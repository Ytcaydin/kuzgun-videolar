#!/bin/bash
# finish.sh raw.mp4 mix.wav out.mp4
ffmpeg -nostdin -v error -y -i "$1" -i "$2" -filter_complex "[0:v]noise=alls=7:allf=t+u,eq=contrast=1.04:saturation=1.06:gamma=0.98,unsharp=3:3:0.3,format=yuv420p[v];[1:a]loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000[a]" -map "[v]" -map "[a]" -c:v libx264 -preset medium -crf 19 -maxrate 9M -bufsize 18M -r 30 -c:a aac -b:a 192k -movflags +faststart -shortest "$3"
