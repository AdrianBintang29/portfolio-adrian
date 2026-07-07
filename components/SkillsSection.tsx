export default function SkillsSection() {
  return (
    <section id="skills" className="max-w-2xl mx-6 sm:mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
        <span className="w-8 h-[2px] bg-amber-600"></span> Keahlian
      </h2>
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-3 bg-gray-50 rounded-lg text-center">
          <p className="font-medium text-sm text-gray-800">Next.js</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg text-center">
          <p className="font-medium text-sm text-gray-800">Tailwind CSS</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg text-center">
          <p className="font-medium text-sm text-gray-800">Go (Golang)</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg text-center">
          <p className="font-medium text-sm text-gray-800">PostgreSQL</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg text-center">
          <p className="font-medium text-sm text-gray-800">PHP & MySQL</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg text-center">
          <p className="font-medium text-sm text-gray-800">C++</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg text-center">
          <p className="font-medium text-sm text-gray-800">Figma</p>
        </div>
      </div>
    </section>
  );
}