export default function TopicCard({ id, title, description, icon, isActive, onClick }) {
  return (
    <div 
      className={`bg-gradient-to-br rounded-xl p-6 shadow-md hover:shadow-lg transition-all cursor-pointer ${
        isActive 
          ? 'from-blue-100 to-indigo-100 border-2 border-blue-300' 
          : 'from-white to-gray-50 border border-gray-100'
      }`}
      onClick={() => onClick(id)}
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-indigo-800">{title}</h3>
      <p className="text-gray-600">
        {description}
      </p>
    </div>
  );
}