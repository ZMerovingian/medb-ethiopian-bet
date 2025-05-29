
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DiceGame from "@/components/games/DiceGame";
import SlotsGame from "@/components/games/SlotsGame";
import CrashGame from "@/components/games/CrashGame";
import { Dice1, Gem, TrendingUp } from "lucide-react";
import { Session } from "@supabase/supabase-js";

interface GamePlayProps {
  session: Session | null;
}

const GamePlay = ({ session }: GamePlayProps) => {
  if (!session) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400">Please sign in to play games.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Casino Games</h1>
        <p className="text-slate-400">Play provably fair games with instant payouts</p>
      </div>

      <Tabs defaultValue="dice" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800 mb-6">
          <TabsTrigger value="dice" className="flex items-center gap-2 text-slate-300">
            <Dice1 className="w-4 h-4" />
            Dice
          </TabsTrigger>
          <TabsTrigger value="slots" className="flex items-center gap-2 text-slate-300">
            <Gem className="w-4 h-4" />
            Slots
          </TabsTrigger>
          <TabsTrigger value="crash" className="flex items-center gap-2 text-slate-300">
            <TrendingUp className="w-4 h-4" />
            Crash
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dice">
          <DiceGame session={session} />
        </TabsContent>
        
        <TabsContent value="slots">
          <SlotsGame session={session} />
        </TabsContent>
        
        <TabsContent value="crash">
          <CrashGame session={session} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GamePlay;
