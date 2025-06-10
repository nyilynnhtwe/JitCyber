export default function SecurityTip({ number, text }) {
  return (
    <div className="flex items-start">
      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-3">
        {number}
      </div>
      <p className="text-gray-700">{text}</p>
    </div>
  );
}