"use client";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InfoModal({ isOpen, onClose }: InfoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800 p-6 rounded-xl max-w-md w-[90%] max-h-[90vh] relative shadow-xl">
        
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4 text-white">
          What is this and why this matters:
        </h2>

        {/* IMAGE */}
        <div className="mb-5 flex justify-center">

            <img
            src="/rat-race.png"
            alt="Worker running on a hamster wheel"
            className="rounded-lg mb-3 w-full"
            />

        </div>


        <p className="text-gray-300 text-sm leading-relaxed">
            Work. Salary. Expenses. Repeat.
            <br /><br />
            A cycle many of us live in — trading time for money.
            waiting until retirement to finally breathe.
            <br /><br />


            But what if financial freedom didn’t have to wait until 60?
            <br /><br />

            The strategy is simple:
            <br />
            - Earn first (trade time for money).
            <br />
            - Then invest (use earned money to buy back your time).
            <br /><br />

            If you consistently invest a fixed amount every month,
            this tool calculates how long it will take before
            your investments can sustain your lifestyle.
            <br /><br />

            So you can finally Escape the Rat Race.
            <br /><br />
            Because time — not money — is the real asset.



        </p>

      </div>
    </div>
  );
}