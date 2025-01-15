from hashlib import sha256
from pathlib import Path
import torch

path = Path(__file__).parent.parent / 'kokoro-v0_19.pth'
assert path.exists(), f'No model pth found at {path}'

net = torch.load(path, map_location='cpu', weights_only=True)['net']
for a in net:
    for b in net[a]:
        net[a][b] = net[a][b].half()

torch.save(dict(net=net), 'kokoro-v0_19-half.pth')
with open('kokoro-v0_19-half.pth', 'rb') as rb:
    h = sha256(rb.read()).hexdigest()

assert h == '70cbf37f84610967f2ca72dadb95456fdd8b6c72cdd6dc7372c50f525889ff0c', h
