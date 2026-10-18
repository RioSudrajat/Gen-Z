"""Compose an original 120 BPM instrumental loop without third-party samples."""
from pathlib import Path
import wave
import numpy as np

SR, DURATION, BEAT = 48000, 40, .5
rng = np.random.default_rng(20261016)
score = np.zeros((SR * DURATION, 2), dtype=np.float64)

def put(signal, when, gain=1, pan=0):
    start = round(when * SR)
    signal = signal[:len(score) - start]
    score[start:start+len(signal), 0] += signal * gain * np.sqrt((1-pan)/2)
    score[start:start+len(signal), 1] += signal * gain * np.sqrt((1+pan)/2)

def tone(midi, length, kind):
    t = np.arange(round(length * SR)) / SR
    freq = 440 * 2 ** ((midi-69)/12)
    if kind == 'pad':
        env = np.minimum(t/.14,1) * np.minimum((length-t)/.25,1)
        return (np.sin(2*np.pi*freq*t)+.22*np.sin(2*np.pi*freq*1.003*t))*env
    if kind == 'bass':
        return (np.sin(2*np.pi*freq*t)+.17*np.sin(4*np.pi*freq*t))*(1-np.exp(-t*140))*np.exp(-t*5)
    return (np.sin(2*np.pi*freq*t)+.28*np.sin(4*np.pi*freq*t)+.08*np.sin(6*np.pi*freq*t))*(1-np.exp(-t*350))*np.exp(-t*9)

chords=[(48,51,55,58),(44,48,51,55),(51,55,58,62),(46,50,53,58)]
for bar in range(20):
    chord=chords[bar%4]
    for i,note in enumerate(chord):
        put(tone(note+12,1.96,'pad'),bar*2,.034,(i-1.5)/3)
    for step in range(8):
        note=chord[[0,2,1,3,2,1,3,2][step]]+24
        put(tone(note,.45,'pluck'),bar*2+step*.25,.065 if step%2==0 else .04,-.45 if step%2 else .45)
    for step in [0,2,3]:
        put(tone(chord[0]-12,.48,'bass'),bar*2+step*BEAT,.14)
for beat in range(80):
    t=np.arange(int(.23*SR))/SR
    kick=np.sin(2*np.pi*(48*t+30*(1-np.exp(-t*28))/28))*np.exp(-t*22)*(1-np.exp(-t*900))
    put(kick,beat*BEAT,.17 if beat%4==0 else .11)
    if beat%2:
        t=np.arange(int(.16*SR))/SR
        noise=rng.standard_normal(len(t))
        put(np.diff(noise,prepend=0)*np.exp(-t*40)*.25,beat*BEAT,.052,-.1)
    for off in [0,.25]:
        t=np.arange(int(.07*SR))/SR
        noise=rng.standard_normal(len(t))
        put(np.diff(noise,prepend=0)*np.exp(-t*95),beat*BEAT+off,.011 if off else .007,.3 if off else -.3)
dry=score.copy()
for seconds,amount in [(.125,.12),(.375,.07)]:
    score[:,0]+=np.roll(dry[:,1],round(seconds*SR))*amount
    score[:,1]+=np.roll(dry[:,0],round(seconds*SR))*amount
score=np.tanh(score*1.4)
score*=.4/max(np.abs(score).max(),.01)
edge=round(.015*SR)
score[:edge]*=np.linspace(0,1,edge)[:,None]
score[-edge:]*=np.linspace(1,0,edge)[:,None]
output=Path(__file__).resolve().parent/'public'/'pulse-score.wav'
with wave.open(str(output),'wb') as file:
    file.setnchannels(2);file.setsampwidth(2);file.setframerate(SR)
    file.writeframes((score*32767).astype('<i2').tobytes())
print(f'Original instrumental: {DURATION}s, 120 BPM, stereo 48 kHz: {output}')
