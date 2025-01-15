# Restoring Sky & reflecting on Kokoro

<img src="https://static0.gamerantimages.com/wordpress/wp-content/uploads/2024/08/terminator-zero-41-1.jpg" width="400" alt="kokoro" />

For those who don't know, [Kokoro](https://huggingface.co/hexgrad/Kokoro-82M) is an Apache TTS model that uses a skinny version of the open [StyleTTS 2](https://github.com/yl4579/StyleTTS2/tree/main) architecture.

Based on leaderboard [Elo rating](https://huggingface.co/hexgrad/Kokoro-82M#evaluation) (prior to getting [review bombed](https://huggingface.co/datasets/Pendrokar/TTS_Arena/discussions/2)), Kokoro appears to do more with less, a theme that is surely [top-of-mind](https://huggingface.co/deepseek-ai/DeepSeek-V3) for many. It's peak performance on specific voices is comparable or better than much larger models, but it has not yet been trained on enough data to effectively zero-shot out of distribution (aka voice cloning).

Tonight on NYE, `af_sky` joins Kokoro's roster of downloadable voices. This follows last night's quiet release of `af_nicole`, and an additional 8 voices are currently available: 2F 2M voices each for American & British English.

Nicole in particular was trained on ~10 hours of synthetic data, and demonstrates that you _can_ include unique speaking styles in a general-purpose TTS model without affecting the stock voices (even in a low data small model): a good sign for scalability.

Sky is interesting because it is the voice that ScarJo [got OpenAI to take down](https://x.com/OpenAI/status/1792443575839678909), so new training data cannot be generated. However, OpenAI did not remove 2023 samples of Sky from their [blog post](https://openai.com/index/chatgpt-can-now-see-hear-and-speak/), and along with a few seconds lying around various other parts of the internet, we can cobble together about 3 minutes of 2023 Sky.

```sh
wget https://cdn.openai.com/new-voice-and-image-capabilities-in-chatgpt/hd/story-sky.mp3
wget https://cdn.openai.com/new-voice-and-image-capabilities-in-chatgpt/hd/recipe-sky.mp3
wget https://cdn.openai.com/new-voice-and-image-capabilities-in-chatgpt/hd/speech-sky.mp3
wget https://cdn.openai.com/new-voice-and-image-capabilities-in-chatgpt/hd/poem-sky.mp3
wget https://cdn.openai.com/new-voice-and-image-capabilities-in-chatgpt/hd/info-sky.mp3
```

To be clear, this is not the first attempt to reconstruct Sky. On X, Benjamin De Kraker posted:
> Here's the official statement released by Scarlett Johansson, detailing OpenAI's alleged illegal usage of her voice...
> ...read by the Sky AI voice, because irony.
> https://x.com/BenjaminDEKR/status/1792693868497871086

and in the replies, he [stated](https://x.com/BenjaminDEKR/status/1792714347275501595):
> It's an ElevenLabs clone I made based on Sky audio before they removed it. Not perfect.

Here is `Kokoro/af_sky`'s rendition of the same:
<audio controls><source src="https://huggingface.co/hexgrad/Kokoro-82M/resolve/main/demo/af_sky.wav" type="audio/wav"></audio>

A crude reconstruction, but the model that produced that voice is Apache FOSS that can be downloaded from HF and run locally. You can reproduce the above by dragging the [text script](https://huggingface.co/hexgrad/Kokoro-82M/blob/main/demo/af_sky.txt) (note a handful of modified chars for better delivery) into the "Long Form" tab of this [hosted demo](https://huggingface.co/spaces/hexgrad/Kokoro-TTS), or you can download the [model weights](https://huggingface.co/hexgrad/Kokoro-82M), install dependencies and DIY.

Sky shows that it is possible to reconstruct a voice—maybe a shadow of its former self, but a reconstruction nonetheless—from fairly little training data.

### What's next

Kokoro is a good start, but I can think of some tricks that might make it better, beginning with better data. More on this in another article.

Feel free to check out [Kokoro's weights](https://huggingface.co/hexgrad/Kokoro-82M), try out a no-install [hosted demo](https://huggingface.co/spaces/hexgrad/Kokoro-TTS), and/or [join the Discord](https://discord.gg/QuGxSWBfQy).