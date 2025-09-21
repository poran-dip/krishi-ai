import { useState } from "react";
import { Lightbulb, X } from "lucide-react";
import { MarketPrice } from "@/services/marketPriceService";

interface MarketInsightCardProps {
  marketPrices: MarketPrice[];
}

const MarketInsightCard = ({ marketPrices }: MarketInsightCardProps) => {
  const [visible, setVisible] = useState(true);
  if (!visible || marketPrices.length === 0) return null;

  // pick biggest absolute change
  let biggestChange: MarketPrice = marketPrices[0];
  let biggestValue = Math.abs(parseFloat(biggestChange.change.replace('%', '').replace('+', '')));

  marketPrices.forEach(item => {
    const changeVal = Math.abs(parseFloat(item.change.replace('%', '').replace('+', '').replace('-', '')));
    if (changeVal > biggestValue) {
      biggestChange = item;
      biggestValue = changeVal;
    }
  });

  const isUp = biggestChange.change.startsWith('+');

  return (
    <div className="relative mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
      <button
        onClick={() => setVisible(false)}
        className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center text-blue-600 hover:text-blue-800 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Lightbulb className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <h4 className="font-medium text-blue-900 text-sm sm:text-base mb-1">
            Market Insight
          </h4>
          <p className="text-xs sm:text-sm text-blue-800 leading-relaxed">
            {biggestChange.crop} prices {isUp ? 'are surging' : 'dipped'} ({biggestChange.change}) at {biggestChange.location}.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MarketInsightCard;
