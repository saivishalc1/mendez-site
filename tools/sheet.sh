#!/bin/zsh
# Stitch <prefix>-NN.jpg screens into one contact sheet (ffmpeg, 3 columns, half size). Usage: sheet.sh <prefix> <out.jpg>
prefix=$1; out=$2; fs=(${prefix}-*.jpg(N)); n=${#fs}; cols=3; rows=$(( (n + cols - 1) / cols ))
args=(); for f in $fs; do args+=(-i $f); done
w=$(ffprobe -v error -select_streams v -show_entries stream=width -of csv=p=0 $fs[1]); sw=$(( w > 1000 ? w/2 : w*4/5 ))
fc=""; lay=""; for ((k=0;k<n;k++)); do fc+="[$k]scale=$sw:-2[s$k];"; x=$(( k % cols )); y=$(( k / cols )); lay+="${lay:+|}$(( x ))_$(( y ))"; done
# build layout with pixel offsets
h=$(ffprobe -v error -select_streams v -show_entries stream=height -of csv=p=0 $fs[1]); sh=$(( h * sw / w ))
lay=""; ins=""; for ((k=0;k<n;k++)); do lay+="${lay:+|}$(( (k % cols) * sw ))_$(( (k / cols) * sh ))"; ins+="[s$k]"; done
ffmpeg -nostdin -v error -y $args -filter_complex "${fc}${ins}xstack=inputs=${n}:layout=${lay}:fill=magenta" $out && echo "$out ($n screens)"
