import os
import pickle
from pathlib import Path
import numpy as np
from fastapi import FastAPI
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
try:
    from tensorflow.keras.preprocessing.sequence import pad_sequences
except ImportError:
    # Fallback for newer Keras/TensorFlow versions
    from tensorflow.keras.utils import pad_sequences

try:
    from tensorflow.keras.models import load_model
except ImportError:
    from keras.models import load_model

import warnings
warnings.filterwarnings("ignore")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Models
models_dir = Path(__file__).resolve().parent.parent / 'models'

# Load Tokenizer
with open(models_dir / 'tokenizer.pkl', 'rb') as f:
    tokenizer = pickle.load(f)

# Create index to word mapping
index_to_word = {i: w for w, i in tokenizer.word_index.items()}

# Load max length
with open(models_dir / 'max_len.pkl', 'rb') as f:
    max_len = pickle.load(f)

# Load Model
lstm_model = load_model(models_dir / 'lstm_model.h5')

class TextData(BaseModel):
    text: str = Field(..., description="The seed text to start completion from")
    num_words: int = Field(default=5, ge=1, le=50, description="Number of words to generate")

class PredictionResponse(BaseModel):
    generated_text: str

def predictor(model, tokenizer, text, max_len):
    text = text.lower()
    seq_list = tokenizer.texts_to_sequences([text])
    if not seq_list or not seq_list[0]:
        return ""
    seq = seq_list[0]
    seq = pad_sequences([seq], maxlen=max_len, padding='pre')
    pred = model.predict(seq, verbose=0)
    pred_index = np.argmax(pred)
    if pred_index == 0:
        return ""
    return index_to_word.get(pred_index, "")

def generate_text(model, tokenizer, seed_text, max_len, n_words):
    current_text = seed_text
    for _ in range(n_words):
        next_word = predictor(model, tokenizer, current_text, max_len)
        if not next_word:
            break
        current_text += " " + next_word
    return current_text

@app.get("/")
def greet():
    return {"message": "Welcome to the Sentence Completion API!"}

@app.post("/predict", response_model=PredictionResponse)
def predict(data: TextData):
    try:
        completed_text = generate_text(lstm_model, tokenizer, data.text, max_len, data.num_words)
        return PredictionResponse(generated_text=completed_text)
    except Exception as e:
        return PredictionResponse(generated_text=f"Error generating text: {str(e)}")
