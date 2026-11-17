import os
import subprocess
import imageio_ffmpeg

exe = imageio_ffmpeg.get_ffmpeg_exe()

TARGETS = [
    {
        'id': 'obstacle-detection',
        'src': 'public/Videos/AI_smart_glasses_obstacle_detection_944cae0f_1080p (1).mp4',
    },
    {
        'id': 'medicine-assistance',
        'src': 'public/Videos/Man_using_smart_glasses_f1f2d398_1080p.mp4',
    },
    {
        'id': 'sos-safety',
        'src': 'public/Videos/Woman_activating_smart_glasses_SOS_8dacdb79_1080p.mp4',
    },
]

results = []

for t in TARGETS:
    base_id = t['id']
    inp = t['src']
    orig_size = os.path.getsize(inp)
    
    poster_path = f'public/Videos/{base_id}-poster.webp'
    mp4_720_path = f'public/Videos/{base_id}-720p.mp4'
    webm_720_path = f'public/Videos/{base_id}-720p.webm'
    mp4_540_path = f'public/Videos/{base_id}-540p.mp4'
    webm_540_path = f'public/Videos/{base_id}-540p.webm'
    
    print(f'=== Processing {base_id} (Original: {orig_size / 1024:.1f} KB) ===')
    
    # 1. Poster WebP
    subprocess.run([
        exe, '-y', '-ss', '0.1', '-i', inp,
        '-vframes', '1', '-vf', 'scale=720:1280',
        '-c:v', 'libwebp', '-quality', '82',
        poster_path
    ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    # 2. 720p MP4 (H.264)
    subprocess.run([
        exe, '-y', '-i', inp, '-an',
        '-vf', 'scale=720:1280:flags=lanczos',
        '-c:v', 'libx264', '-crf', '23', '-preset', 'medium',
        '-movflags', '+faststart',
        mp4_720_path
    ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    # 3. 720p WebM (VP9)
    subprocess.run([
        exe, '-y', '-i', inp, '-an',
        '-vf', 'scale=720:1280:flags=lanczos',
        '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '30',
        webm_720_path
    ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    # 4. 540p MP4 (Mobile H.264)
    subprocess.run([
        exe, '-y', '-i', inp, '-an',
        '-vf', 'scale=540:960:flags=lanczos',
        '-c:v', 'libx264', '-crf', '24', '-preset', 'medium',
        '-movflags', '+faststart',
        mp4_540_path
    ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    # 5. 540p WebM (Mobile VP9)
    subprocess.run([
        exe, '-y', '-i', inp, '-an',
        '-vf', 'scale=540:960:flags=lanczos',
        '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '32',
        webm_540_path
    ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    poster_kb = os.path.getsize(poster_path) / 1024
    mp4_720_kb = os.path.getsize(mp4_720_path) / 1024
    webm_720_kb = os.path.getsize(webm_720_path) / 1024
    mp4_540_kb = os.path.getsize(mp4_540_path) / 1024
    webm_540_kb = os.path.getsize(webm_540_path) / 1024

    results.append({
        'id': base_id,
        'orig_kb': orig_size / 1024,
        'poster_kb': poster_kb,
        'mp4_720_kb': mp4_720_kb,
        'webm_720_kb': webm_720_kb,
        'mp4_540_kb': mp4_540_kb,
        'webm_540_kb': webm_540_kb,
    })
    print(f'Done {base_id}: Poster={poster_kb:.1f}KB, 720p MP4={mp4_720_kb:.1f}KB, 720p WebM={webm_720_kb:.1f}KB, 540p MP4={mp4_540_kb:.1f}KB, 540p WebM={webm_540_kb:.1f}KB')

print('\n=== SUMMARY ===')
for r in results:
    reduction_720 = (1 - r['mp4_720_kb'] / r['orig_kb']) * 100
    reduction_540 = (1 - r['mp4_540_kb'] / r['orig_kb']) * 100
    print(f"{r['id']}: Original={r['orig_kb']/1024:.2f}MB -> 720p MP4={r['mp4_720_kb']/1024:.2f}MB (-{reduction_720:.1f}%), 540p MP4={r['mp4_540_kb']/1024:.2f}MB (-{reduction_540:.1f}%)")

