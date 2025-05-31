
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from "lucide-react";
import { Session } from "@supabase/supabase-js";

interface DiceGameProps {
  session: Session;
}

const DiceGame = ({ session }: DiceGameProps) => {
  const [betAmount, setBetAmount] = useState("10");
  const [prediction, setPrediction] = useState(50);
  const [isRolling, setIsRolling] = useState(false);
  const [lastRoll, setLastRoll] = useState<number | null>(null);
  const [balance, setBalance] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    fetchBalance();
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

  const rollDice = async () => {
    if (parseFloat(betAmount) > balance) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough balance for this bet.",
        variant: "destructive",
      });
      return;
    }

    setIsRolling(true);

    try {
      // Generate random number between 0-100
      const roll = Math.floor(Math.random() * 101);
      setLastRoll(roll);

      const isWin = roll < prediction;
      const multiplier = isWin ? (99 / prediction) : 0;
      const payout = isWin ? parseFloat(betAmount) * multiplier : 0;

      // Create game session
      const { data, error } = await supabase
        .from('game_sessions')
        .insert({
          user_id: session.user.id,
          game_id: 'dice-game',
          bet_amount: parseFloat(betAmount),
          result: { roll, prediction, isWin },
          payout: payout,
          status: 'completed'
        });

      if (error) throw error;

      // Update balance
      const newBalance = isWin ? balance + payout - parseFloat(betAmount) : balance - parseFloat(betAmount);
      
      const { error: balanceError } = await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('user_id', session.user.id);

      if (balanceError) throw balanceError;

      setBalance(newBalance);

      toast({
        title: isWin ? "You won!" : "You lost",
        description: isWin ? 
          `You won ${payout.toFixed(2)} ETB! Roll: ${roll}` : 
          `Better luck next time! Roll: ${roll}`,
        variant: isWin ? "default" : "destructive",
      });

    } catch (error: any) {
      toast({
        title: "Game error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsRolling(false);
    }
  };

  const getDiceIcon = (value: number) => {
    const iconClass = "w-12 h-12 text-yellow-400";
    if (value <= 16) return <Dice1 className={iconClass} />;
    if (value <= 33) return <Dice2 className={iconClass} />;
    if (value <= 50) return <Dice3 className={iconClass} />;
    if (value <= 66) return <Dice4 className={iconClass} />;
    if (value <= 83) return <Dice5 className={iconClass} />;
    return <Dice6 className={iconClass} />;
  };

  const winChance = prediction;
  const multiplier = 99 / prediction;
  const potentialWin = parseFloat(betAmount || "0") * multiplier;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Game Controls */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Dice Game</CardTitle>
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
            />
            <p className="text-sm text-slate-400">Balance: {balance.toFixed(2)} ETB</p>
          </div>

          <div className="space-y-4">
            <Label className="text-slate-300">Roll Under: {prediction}</Label>
            <Slider
              value={[prediction]}
              onValueChange={(value) => setPrediction(value[0])}
              max={95}
              min={2}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-slate-400">
              <span>2</span>
              <span>95</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-slate-700 p-3 rounded">
              <div className="text-slate-400">Win Chance</div>
              <div className="text-white font-bold">{winChance.toFixed(1)}%</div>
            </div>
            <div className="bg-slate-700 p-3 rounded">
              <div className="text-slate-400">Multiplier</div>
              <div className="text-white font-bold">{multiplier.toFixed(2)}x</div>
            </div>
          </div>

          <div className="bg-slate-700 p-3 rounded">
            <div className="text-slate-400 text-sm">Potential Win</div>
            <div className="text-yellow-400 font-bold text-lg">{potentialWin.toFixed(2)} ETB</div>
          </div>

          <Button
            onClick={rollDice}
            disabled={isRolling || !betAmount || parseFloat(betAmount) <= 0}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900 font-bold"
          >
            {isRolling ? "Rolling..." : "Roll Dice"}
          </Button>
        </CardContent>
      </Card>

      {/* Game Display */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Result</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="mb-4">
              {lastRoll !== null && getDiceIcon(lastRoll)}
            </div>
            {lastRoll !== null && (
              <div className="space-y-2">
                <div className="text-4xl font-bold text-white">{lastRoll}</div>
                <div className={`text-lg font-medium ${lastRoll < prediction ? 'text-green-400' : 'text-red-400'}`}>
                  {lastRoll < prediction ? 'WIN' : 'LOSE'}
                </div>
              </div>
            )}
          </div>

          <div className="bg-slate-700 p-4 rounded">
            <h3 className="text-white font-medium mb-2">How to Play</h3>
            <ul className="text-slate-400 text-sm space-y-1">
              <li>• Set your bet amount</li>
              <li>• Choose a number to roll under (2-95)</li>
              <li>• Higher prediction = higher win chance, lower multiplier</li>
              <li>• Lower prediction = lower win chance, higher multiplier</li>
              <li>• If the roll is under your prediction, you win!</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiceGame;
