import React, { useState, useEffect } from 'react';
import { Question, QuestionType, MatchingPair } from '../types';
import { FEEDBACK_MESSAGES } from '../constants';
import { playSound } from '../services/audioService';
import { Button } from './Button';
import { CheckCircle2, XCircle, Hand, Moon, Activity, Trophy, Star, Sparkles } from 'lucide-react';

interface GameScreenProps {
  questions: Question[];
  onEnd: (score: number, history: boolean[]) => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ questions, onEnd }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState<boolean[]>([]);
  const [showFeedback, setShowFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [isLocked, setIsLocked] = useState(false);

  // Ordering State
  const [orderedItems, setOrderedItems] = useState<string[]>([]);
  
  // Matching State
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);

  const currentQ = questions[currentIdx];

  // Helper to move to next or end
  const handleNext = (isCorrect: boolean) => {
    setIsLocked(true);
    const newHistory = [...history, isCorrect];
    setHistory(newHistory);
    
    if (isCorrect) {
      setScore(s => s + 10);
      const randomMsg = FEEDBACK_MESSAGES[Math.floor(Math.random() * FEEDBACK_MESSAGES.length)];
      setFeedbackMsg(randomMsg);
      setShowFeedback('correct');
      playSound('correct');
    } else {
      setFeedbackMsg("حاول مرة أخرى");
      setShowFeedback('wrong');
      playSound('wrong');
    }

    setTimeout(() => {
      setShowFeedback('none');
      setIsLocked(false);
      setOrderedItems([]);
      setMatchedPairs(new Set());
      setSelectedLeft(null);
      setFeedbackMsg("");
      
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(prev => prev + 1);
      } else {
        onEnd(isCorrect ? score + 10 : score, newHistory);
      }
    }, 2500); // Increased slightly to let them read the message
  };

  // --- Handlers ---

  const handleOptionClick = (option: string | boolean) => {
    if (isLocked) return;
    const isCorrect = option === currentQ.correctAnswer;
    handleNext(isCorrect);
  };

  const handleOrderClick = (item: string) => {
    if (isLocked) return;
    // Toggle: if in list, remove. If not, add.
    let newOrder;
    if (orderedItems.includes(item)) {
       newOrder = orderedItems.filter(i => i !== item);
    } else {
       newOrder = [...orderedItems, item];
    }
    setOrderedItems(newOrder);

    // If all items selected, check order
    if (currentQ.correctOrder && newOrder.length === currentQ.correctOrder.length) {
      const isCorrect = JSON.stringify(newOrder) === JSON.stringify(currentQ.correctOrder);
      handleNext(isCorrect);
    }
  };

  const handleMatchClick = (side: 'left' | 'right', id: string, pairId: string) => {
    if (isLocked) return;
    
    if (side === 'left') {
        setSelectedLeft(pairId); // Store the Pair ID, not the item ID, for easy comparison
        playSound('click');
    } else {
        // Right side clicked
        if (!selectedLeft) return;

        if (selectedLeft === pairId) {
            // Match found!
            const newMatches = new Set(matchedPairs);
            newMatches.add(pairId);
            setMatchedPairs(newMatches);
            setSelectedLeft(null);
            playSound('correct');

            // Check if all matched
            if (currentQ.matchingPairs && newMatches.size === currentQ.matchingPairs.length) {
                handleNext(true);
            }
        } else {
            // Wrong match
            playSound('wrong');
            setSelectedLeft(null);
        }
    }
  };

  // --- Renderers ---

  const renderProgressBar = () => (
    <div className="w-full bg-white/50 h-5 rounded-full mb-6 flex overflow-hidden border-2 border-white">
      <div 
        className="bg-kid-orange transition-all duration-500 ease-out" 
        style={{ width: `${((currentIdx) / questions.length) * 100}%` }}
      />
    </div>
  );

  const renderFeedbackOverlay = () => {
    if (showFeedback === 'none') return null;
    return (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm rounded-[3rem]">
            <div className={`relative p-8 md:p-12 rounded-[2rem] shadow-[0_10px_0_rgba(0,0,0,0.1)] flex flex-col items-center animate-bounce-in max-w-sm w-full mx-4 border-4 ${showFeedback === 'correct' ? 'bg-kid-yellow border-white' : 'bg-white border-red-200'}`}>
                
                {showFeedback === 'correct' && (
                  <>
                    <div className="absolute -top-6 -left-6 text-kid-orange animate-spin-slow"><Star size={48} fill="currentColor" /></div>
                    <div className="absolute -bottom-6 -right-6 text-kid-blue animate-bounce"><Star size={48} fill="currentColor" /></div>
                    <div className="absolute top-0 right-10 text-pink-400 animate-pulse"><Sparkles size={32} /></div>
                    
                    <CheckCircle2 size={80} className="text-green-500 mb-4 drop-shadow-sm" />
                    <h2 className="text-4xl md:text-5xl font-black text-kid-navy text-center mb-2">{feedbackMsg}</h2>
                  </>
                )}
                
                {showFeedback === 'wrong' && (
                  <>
                     <XCircle size={80} className="text-red-500 mb-4 drop-shadow-sm" />
                     <h2 className="text-4xl font-black text-red-500 text-center">{feedbackMsg}</h2>
                  </>
                )}
            </div>
        </div>
    );
  };

  const renderMultipleChoice = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      {currentQ.options?.map((opt, i) => (
        <Button 
          key={i} 
          onClick={() => handleOptionClick(opt)}
          className="text-xl md:text-2xl py-6 min-h-[80px]"
          variant="secondary"
        >
          {opt}
        </Button>
      ))}
    </div>
  );

  const renderTrueFalse = () => (
    <div className="flex flex-col md:flex-row gap-6 justify-center w-full">
        <Button onClick={() => handleOptionClick(true)} className="flex-1 text-3xl py-10 bg-green-400 hover:bg-green-500 text-white border-b-8 border-green-600 active:border-b-0 active:translate-y-2">
            ✔ صح
        </Button>
        <Button onClick={() => handleOptionClick(false)} className="flex-1 text-3xl py-10 bg-red-400 hover:bg-red-500 text-white border-b-8 border-red-600 active:border-b-0 active:translate-y-2">
            ✘ خطأ
        </Button>
    </div>
  );

  const renderOrdering = () => {
    const displayItems = ["إيمان ترفع يدها", "إيمان تجيب", "المعلم يسأل", "المعلم يختارها"];

    return (
        <div className="w-full flex flex-col gap-4">
            <p className="text-center text-kid-navy text-lg font-bold mb-2">اضغط على الجمل بالترتيب الصحيح:</p>
            
            <div className="flex flex-wrap gap-2 justify-center mb-6 min-h-[80px] bg-white/60 rounded-xl p-4 border-2 border-dashed border-kid-blue shadow-inner">
                {orderedItems.length === 0 && <span className="text-gray-400 self-center">...</span>}
                {orderedItems.map((item, idx) => (
                    <span key={idx} className="bg-kid-orange text-kid-navy px-4 py-2 rounded-xl font-bold animate-pop shadow-sm border-b-2 border-yellow-600">
                        {idx + 1}. {item}
                    </span>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-3">
                {displayItems.map((item, i) => {
                    const isSelected = orderedItems.includes(item);
                    return (
                        <button
                            key={i}
                            disabled={isSelected}
                            onClick={() => handleOrderClick(item)}
                            className={`p-4 rounded-2xl font-bold text-lg transition-all border-2 ${
                                isSelected 
                                ? 'bg-gray-100 text-gray-400 scale-95 border-gray-200' 
                                : 'bg-white text-kid-navy shadow-md hover:scale-[1.02] active:scale-95 border-kid-blue'
                            }`}
                        >
                            {item}
                        </button>
                    )
                })}
            </div>
        </div>
    );
  };

  const renderMatching = () => (
    <div className="w-full flex gap-4 justify-between">
        <div className="flex-1 flex flex-col gap-3">
            {currentQ.matchingPairs?.map((pair) => {
                const isMatched = matchedPairs.has(pair.id);
                const isSelected = selectedLeft === pair.id;
                return (
                    <button
                        key={`l-${pair.id}`}
                        disabled={isMatched}
                        onClick={() => handleMatchClick('left', pair.left, pair.id)}
                        className={`p-4 rounded-xl font-bold text-lg transition-all border-b-4 ${
                            isMatched ? 'bg-green-200 border-green-400 opacity-60 text-green-800' : 
                            isSelected ? 'bg-kid-yellow border-kid-orange scale-105 text-kid-navy' : 
                            'bg-white border-gray-200 shadow-sm text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        {pair.left}
                    </button>
                )
            })}
        </div>
        <div className="flex-1 flex flex-col gap-3">
            {currentQ.matchingPairs?.map((pair) => {
                 const isMatched = matchedPairs.has(pair.id);
                 return (
                    <button
                        key={`r-${pair.id}`}
                        disabled={isMatched}
                        onClick={() => handleMatchClick('right', pair.right, pair.id)}
                        className={`p-4 rounded-xl font-bold text-lg transition-all border-b-4 ${
                            isMatched ? 'bg-green-200 border-green-400 opacity-60 text-green-800' : 
                            'bg-kid-blue/20 border-kid-blue hover:bg-kid-blue/40 text-kid-navy'
                        }`}
                    >
                        {pair.right}
                    </button>
                 )
            })}
        </div>
    </div>
  );

  const renderImageChoice = () => {
      // Icons mapping
      const icons: {[key: string]: React.ReactNode} = {
          hand: <Hand size={64} className="text-kid-orange" />,
          sleep: <Moon size={64} className="text-kid-blue" />,
          run: <Activity size={64} className="text-green-500" />
      };

      return (
        <div className="flex gap-4 justify-center w-full">
            {currentQ.options?.map((opt, i) => (
                <button
                    key={i}
                    onClick={() => handleOptionClick(opt)}
                    className="p-8 bg-white rounded-3xl shadow-lg border-b-8 border-gray-200 hover:border-kid-orange active:border-b-0 active:translate-y-2 transition-all"
                >
                    <div className="text-kid-navy">
                        {icons[opt]}
                    </div>
                </button>
            ))}
        </div>
      );
  };

  return (
    <div className="min-h-screen bg-kid-blue p-4 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white/90 backdrop-blur-md rounded-[3rem] p-6 shadow-2xl relative border-4 border-white min-h-[600px] flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6 px-2">
            <div className="bg-kid-yellow px-5 py-2 rounded-full font-black text-kid-navy shadow-sm border-2 border-white">
                سؤال {currentIdx + 1}
            </div>
            <div className="bg-kid-green px-5 py-2 rounded-full font-black text-kid-navy shadow-sm border-2 border-white flex items-center gap-2">
                <Trophy size={24} className="text-yellow-600" />
                {score}
            </div>
        </div>

        {renderProgressBar()}

        {/* Question Area */}
        <div className="flex-grow flex flex-col items-center justify-center w-full relative">
            {renderFeedbackOverlay()}
            
            <h2 className="text-3xl md:text-4xl font-black text-center text-kid-navy mb-10 leading-relaxed drop-shadow-sm">
                {currentQ.text}
            </h2>

            {/* Dynamic Content */}
            {currentQ.type === QuestionType.MULTIPLE_CHOICE && renderMultipleChoice()}
            {currentQ.type === QuestionType.TRUE_FALSE && renderTrueFalse()}
            {currentQ.type === QuestionType.ORDERING && renderOrdering()}
            {currentQ.type === QuestionType.MATCHING && renderMatching()}
            {currentQ.type === QuestionType.IMAGE_CHOICE && renderImageChoice()}
        </div>

      </div>
    </div>
  );
};

export default GameScreen;