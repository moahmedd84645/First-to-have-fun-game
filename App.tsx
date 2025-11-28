import React, { useState } from 'react';
import { GameState } from './types';
import { QUESTIONS } from './constants';
import { playSound } from './services/audioService';
import { Star, Trophy, ArrowRight, Music, Volume2 } from 'lucide-react';
import { Button } from './components/Button';
import GameScreen from './components/GameScreen';

export default function App() {
  const [gameState, setGameState] = useState<GameState>({
    view: 'WELCOME',
    score: 0,
    currentQuestionIndex: 0,
    answersHistory: [],
  });

  const startGame = () => {
    playSound('click');
    setGameState({
      view: 'GAME',
      score: 0,
      currentQuestionIndex: 0,
      answersHistory: [],
    });
  };

  const handleGameEnd = (finalScore: number, history: boolean[]) => {
    // Small delay to show last feedback
    setTimeout(() => {
        playSound('win');
        setGameState(prev => ({
        ...prev,
        score: finalScore,
        answersHistory: history,
        view: 'RESULT'
        }));
    }, 1000);
  };

  const renderWelcome = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-kid-blue to-kid-green p-4 text-center relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-10 left-10 text-white/40 animate-float"><Star size={64} fill="currentColor" /></div>
      <div className="absolute bottom-20 right-10 text-white/40 animate-float" style={{animationDelay: '1s'}}><Star size={48} fill="currentColor" /></div>
      <div className="absolute top-1/2 left-5 text-white/30 animate-pulse"><Volume2 size={32} /></div>

      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-[3rem] shadow-2xl max-w-lg w-full border-4 border-white animate-pop">
        <div className="mb-6 flex justify-center">
          <div className="bg-kid-yellow p-4 rounded-full shadow-lg">
             <Trophy size={64} className="text-kid-orange" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black text-kid-navy mb-4 leading-tight">
          لعبة أول من <br/> <span className="text-kid-orange">رفع يده</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 font-bold">
          هل أنت مستعد لاختبار معلوماتك؟
        </p>

        <Button onClick={startGame} size="lg" className="w-full">
          ابدأ اللعب الآن!
        </Button>
      </div>
      
      <p className="mt-8 text-white font-bold text-lg opacity-80">
        صممت للأذكياء والأبطال الصغار
      </p>
    </div>
  );

  const renderResult = () => {
    let message = "";
    let emoji = "";
    if (gameState.score === 100) {
      message = "أنت بطل الشجاعة!";
      emoji = "👑";
    } else if (gameState.score >= 70) {
      message = "إجابات ممتازة!";
      emoji = "🌟";
    } else {
      message = "حاول مرة أخرى!";
      emoji = "💪";
    }

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-kid-pink p-4 text-center relative">
        <div className="bg-white p-8 rounded-[3rem] shadow-2xl max-w-lg w-full border-4 border-kid-orange animate-pop">
          <div className="text-8xl mb-4 animate-float">{emoji}</div>
          
          <h2 className="text-4xl font-black text-kid-navy mb-2">النتيجة النهائية</h2>
          
          <div className="my-6">
            <span className="text-6xl font-black text-kid-orange">{gameState.score}</span>
            <span className="text-2xl text-gray-400 font-bold">/100</span>
          </div>
          
          <p className="text-2xl font-bold text-kid-green mb-8">{message}</p>

          <div className="flex justify-center gap-2 mb-8">
            {QUESTIONS.map((_, idx) => (
                <div key={idx} className={`w-4 h-4 rounded-full ${idx < gameState.answersHistory.length ? (gameState.answersHistory[idx] ? 'bg-green-500' : 'bg-red-400') : 'bg-gray-200'}`}></div>
            ))}
          </div>

          <Button onClick={startGame} variant="primary" size="lg" className="w-full">
            العب مرة أخرى <ArrowRight className="mr-2 inline" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <main className="font-cairo">
      {gameState.view === 'WELCOME' && renderWelcome()}
      {gameState.view === 'GAME' && (
        <GameScreen 
          questions={QUESTIONS} 
          onEnd={handleGameEnd} 
        />
      )}
      {gameState.view === 'RESULT' && renderResult()}
    </main>
  );
}