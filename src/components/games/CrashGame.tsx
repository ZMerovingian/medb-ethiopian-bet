
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingUp, Zap } from "lucide-react";
import { Session } from "@supabase/supabase-js";

interface CrashGameProps {
  session: Session;
}

const CrashGame = ({ session }: CrashGameProps) => {
  const [betAmount, setBetAmount] = useState("10");
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [hasBet, setHasBet] = useState(false);
  const [multiplier, setMultiplier] = useState(1.00);
  const [gameEnded, setGameEnded] = useState(false);
  const [crashPoint, setCrashPoint] = useState<number | null>(null);
  const [balance, setBalance] = useState(0);
  const [cashedOut, setCashedOut] = useState(false);
  const gameInterval = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchBalance();
  }, []);

  useEffect(() => {
    return () => {
      if (gameInterval.current) {
        clearInterval(gameInterval.current);
      }
    };
  }, []);

  const fetchBalance = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('balance')
        .eq('user_id', session.user.id)
        .single();

      if (error) throw error;
      setBalance(data?.balance || 0);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const generateCrashPoint = () => {
    // Provably fair crash point generation (simplified)
    const random = Math.random();
    const crashPoint = Math.max(1.01, Math.pow(2, random * 10));
    return Math.round(crashPoint * 100) / 100;
  };

  const startGame = () => {
    if (hasBet && parseFloat(betAmount) > balance) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough balance for this bet.",
        variant: "destructive",
      });
      return;
    }

    setIsGameRunning(true);
    setGameEnded(false);
    setCashedOut(false);
    setMultiplier(1.00);
    
    const crash = generateCrashPoint();
    setCrashPoint(crash);

    gameInterval.current = setInterval(() => {
      setMultiplier(prev => {
        const next = prev + 0.01;
        if (next >= crash) {
          endGame(false);
          return crash;
        }
        return next;
      });
    }, 50);
  };

  const endGame = async (playerCashedOut: boolean) => {
    if (gameInterval.current) {
      clearInterval(gameInterval.current);
      gameInterval.current = null;
    }

    setIsGameRunning(false);
    setGameEnded(true);

    if (hasBet) {
      const bet = parseFloat(betAmount);
      const payout = playerCashedOut ? bet * multiplier : 0;
      const isWin = playerCashedOut;

      try {
        // Create game session
        const { data, error } = await supabase
          .from('game_sessions')
          .insert({
            user_id: session.user.id,
            game_id: 'crash-game',
            bet_amount: bet,
            result: { crashPoint, cashedOutAt: playerCashedOut ? multiplier : null },
            payout: payout,
            status: 'completed'
          });

        if (error) throw error;

        // Update balance
        const newBalance = isWin ? balance + payout - bet : balance - bet;
        
        const { error: balanceError } = await supabase
          .from('profiles')
          .update({ balance: newBalance })
          .eq('user_id', session.user.id);

        if (balanceError) throw balanceError;

        setBalance(newBalance);

        toast({
          title: isWin ? "You won!" : "Crashed!",
          description: isWin ? 
            `You cashed out at ${multiplier.toFixed(2)}x and won ${payout.toFixed(2)} ETB!` : 
            `The game crashed at ${crashPoint?.toFixed(2)}x. Better luck next time!`,
          variant: isWin ? "default" : "destructive",
        });

      } catch (error: any) {
        toast({
          title: "Game error",
          description: error.message,
          variant: "destructive",
        });
      }
    }

    setHasBet(false);
  };

  const placeBet = () => {
    if (parseFloat(betAmount) > balance) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough balance for this bet.",
        variant: "destructive",
      });
      return;
    }
    setHasBet(true);
  };

  const cashOut = () => {
    if (hasBet && isGameRunning && !cashedOut) {
      setCashedOut(true);
      endGame(true);
    }
  };

  const potentialWin = hasBet ? parseFloat(betAmount) * multiplier : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Game Controls */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Crash Game</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-slate-300">Bet Amount (ETB)</Label>
            <Input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="Enter bet amount"
              disabled={isGameRunning}
            />
            <p className="text-sm text-slate-400">Balance: {balance.toFixed(2)} ETB</p>
          </div>

          {!isGameRunning && !hasBet && (
            <Button
              onClick={placeBet}
              disabled={!betAmount || parseFloat(betAmount) <= 0}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold"
            >
              Place Bet
            </Button>
          )}

          {!isGameRunning && hasBet && (
            <Button
              onClick={startGame}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold"
            >
              Start Game
            </Button>
          )}

          {isGameRunning && hasBet && !cashedOut && (
            <Button
              onClick={cashOut}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold animate-pulse"
            >
              Cash Out {multiplier.toFixed(2)}x
            </Button>
          )}

          {hasBet && (
            <div className="bg-slate-700 p-4 rounded">
              <div className="text-slate-400 text-sm">Potential Win</div>
              <div className="text-yellow-400 font-bold text-lg">{potentialWin.toFixed(2)} ETB</div>
            </div>
          )}

          <div className="bg-slate-700 p-4 rounded">
            <h3 className="text-white font-medium mb-2">How to Play</h3>
            <ul className="text-slate-400 text-sm space-y-1">
              <li>• Place your bet before the game starts</li>
              <li>• Watch the multiplier increase</li>
              <li>• Cash out before it crashes to win</li>
              <li>• The longer you wait, the higher the risk and reward</li>
              <li>• If you don't cash out before the crash, you lose your bet</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Game Display */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Multiplier
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className={`text-6xl font-bold mb-4 ${
              isGameRunning ? 'text-green-400 animate-pulse' : 
              gameEnded && crashPoint ? 'text-red-400' : 'text-white'
            }`}>
              {multiplier.toFixed(2)}x
            </div>
            
            {gameEnded && crashPoint && (
              <div className="text-red-400 font-medium">
                Crashed at {crashPoint.toFixed(2)}x
              </div>
            )}
            
            {cashedOut && (
              <div className="text-green-400 font-medium">
                Cashed out successfully!
              </div>
            )}
          </div>

          <div className="h-32 bg-slate-700 rounded-lg flex items-center justify-center">
            {isGameRunning ? (
              <div className="flex items-center gap-2 text-green-400">
                <Zap className="w-6 h-6 animate-pulse" />
                <span className="font-medium">Game Running...</span>
              </div>
            ) : gameEnded ? (
              <div className="text-center">
                <div className="text-red-400 font-bold text-xl mb-2">CRASHED!</div>
                <div className="text-slate-400">Game Over</div>
              </div>
            ) : (
              <div className="text-slate-400 text-center">
                <div className="font-medium mb-1">Waiting for players...</div>
                <div className="text-sm">Place your bet to join the next round</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CrashGame;
