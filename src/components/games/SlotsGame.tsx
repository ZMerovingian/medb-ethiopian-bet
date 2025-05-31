import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Cherry, Grape, Apple, Diamond, Gem } from "lucide-react";
import { Session } from "@supabase/supabase-js";

interface SlotsGameProps {
  session: Session;
}

const symbols = [
  { icon: Cherry, name: "Cherry", multiplier: 2 },
  { icon: Grape, name: "Grape", multiplier: 3 },
  { icon: Gem, name: "Gem", multiplier: 4 },
  { icon: Apple, name: "Apple", multiplier: 5 },
  { icon: Diamond, name: "Diamond", multiplier: 10 }
];

const SlotsGame = ({ session }: SlotsGameProps) => {
  const [betAmount, setBetAmount] = useState("10");
  const [isSpinning, setIsSpinning] = useState(false);
  const [reels, setReels] = useState([0, 0, 0]);
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

  const spin = async () => {
    if (parseFloat(betAmount) > balance) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough balance for this bet.",
        variant: "destructive",
      });
      return;
    }

    setIsSpinning(true);

    // Animate spinning
    const spinInterval = setInterval(() => {
      setReels([
        Math.floor(Math.random() * symbols.length),
        Math.floor(Math.random() * symbols.length),
        Math.floor(Math.random() * symbols.length)
      ]);
    }, 100);

    setTimeout(async () => {
      clearInterval(spinInterval);
      
      // Final result
      const finalReels = [
        Math.floor(Math.random() * symbols.length),
        Math.floor(Math.random() * symbols.length),
        Math.floor(Math.random() * symbols.length)
      ];
      
      setReels(finalReels);

      // Check for wins
      let payout = 0;
      const bet = parseFloat(betAmount);

      // Three of a kind
      if (finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2]) {
        payout = bet * symbols[finalReels[0]].multiplier;
      }
      // Two of a kind
      else if (finalReels[0] === finalReels[1] || finalReels[1] === finalReels[2] || finalReels[0] === finalReels[2]) {
        const matchingSymbol = finalReels[0] === finalReels[1] ? finalReels[0] : 
                              finalReels[1] === finalReels[2] ? finalReels[1] : finalReels[0];
        payout = bet * (symbols[matchingSymbol].multiplier * 0.5);
      }

      const isWin = payout > 0;

      try {
        // Create game session
        const { data, error } = await supabase
          .from('game_sessions')
          .insert({
            user_id: session.user.id,
            game_id: 'slots-game',
            bet_amount: bet,
            result: { reels: finalReels, payout },
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
          title: isWin ? "You won!" : "You lost",
          description: isWin ? 
            `You won ${payout.toFixed(2)} ETB!` : 
            "Better luck next time!",
          variant: isWin ? "default" : "destructive",
        });

      } catch (error: any) {
        toast({
          title: "Game error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsSpinning(false);
      }
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Game Controls */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Slots Game</CardTitle>
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

          <Button
            onClick={spin}
            disabled={isSpinning || !betAmount || parseFloat(betAmount) <= 0}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold"
          >
            {isSpinning ? "Spinning..." : "Spin"}
          </Button>

          <div className="bg-slate-700 p-4 rounded">
            <h3 className="text-white font-medium mb-3">Payouts</h3>
            <div className="space-y-2">
              {symbols.map((symbol, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <symbol.icon className="w-4 h-4 text-yellow-400" />
                    <span className="text-slate-300">{symbol.name}</span>
                  </div>
                  <span className="text-white">{symbol.multiplier}x</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Two of a kind pays 0.5x the three of a kind multiplier
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Game Display */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Slot Machine</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-b from-yellow-400 to-yellow-600 p-6 rounded-lg mb-6">
            <div className="flex justify-center gap-4 bg-white rounded-lg p-4">
              {reels.map((symbolIndex, reelIndex) => {
                const Symbol = symbols[symbolIndex].icon;
                return (
                  <div 
                    key={reelIndex} 
                    className={`w-16 h-16 flex items-center justify-center bg-slate-100 rounded ${isSpinning ? 'animate-pulse' : ''}`}
                  >
                    <Symbol className="w-10 h-10 text-slate-700" />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-700 p-4 rounded">
            <h3 className="text-white font-medium mb-2">How to Play</h3>
            <ul className="text-slate-400 text-sm space-y-1">
              <li>• Set your bet amount</li>
              <li>• Click spin to play</li>
              <li>• Match 3 symbols for the full multiplier</li>
              <li>• Match 2 symbols for half the multiplier</li>
              <li>• Higher value symbols = bigger wins!</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SlotsGame;
