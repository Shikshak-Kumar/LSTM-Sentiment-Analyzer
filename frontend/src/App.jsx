import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Sparkles, Loader2, Send } from 'lucide-react';
import './index.css';

function App() {
  const [seedText, setSeedText] = useState('');
  const [numWords, setNumWords] = useState(5);
  const [completedText, setCompletedText] = useState('');
  const [predictedSeedText, setPredictedSeedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePredict = async (e, isSingleWord = false) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!seedText.trim()) return;

    setIsLoading(true);
    setError('');
    setCompletedText('');

    try {
      const currentSeed = seedText;
      const response = await axios.post('http://localhost:8000/predict', {
        text: currentSeed,
        num_words: isSingleWord ? 1 : parseInt(numWords)
      });
      setPredictedSeedText(currentSeed);
      setCompletedText(response.data.generated_text);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred while generating text.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="glass-card">
        <header className="header">
          <div className="logo-container">
            <Sparkles className="logo-icon" />
            <h1>AI Sentence Completion</h1>
          </div>
          <p className="subtitle">Powered by LSTM Neural Networks</p>
        </header>

        <main className="main-content">
          <form onSubmit={(e) => { e.preventDefault(); handlePredict(e, false); }} className="input-form">
            <div className="input-group">
              <label htmlFor="seedText">Enter starting text</label>
              <div className="textarea-wrapper">
                <textarea
                  id="seedText"
                  value={seedText}
                  onChange={(e) => setSeedText(e.target.value)}
                  placeholder="e.g. The quick brown fox..."
                  rows={4}
                  className="glass-input"
                />
              </div>
            </div>

            <div className="controls-group">
              <div className="input-group inline">
                <label htmlFor="numWords">Words to generate</label>
                <input
                  type="number"
                  id="numWords"
                  min="1"
                  max="50"
                  value={numWords}
                  onChange={(e) => setNumWords(e.target.value)}
                  className="glass-input number-input"
                />
              </div>
              <div className="button-group" style={{ display: 'flex', gap: '10px' }}>
                <button 
                  type="button" 
                  className="generate-button"
                  onClick={(e) => handlePredict(e, true)}
                  disabled={isLoading || !seedText.trim()}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="spin-icon" size={18} />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      <span>Next Word</span>
                    </>
                  )}
                </button>
                <button 
                  type="submit" 
                  className="generate-button"
                  disabled={isLoading || !seedText.trim()}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="spin-icon" size={18} />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Complete Text</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {completedText && (
            <div className="result-container fade-in">
              <h3>Generated Result</h3>
              <div className="result-content">
                <span className="seed">{predictedSeedText}</span>
                <span className="generated"> {completedText.replace(predictedSeedText, '')}</span>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
