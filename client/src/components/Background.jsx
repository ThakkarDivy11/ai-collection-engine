export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#020617]">

      {/* Base Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#0b0f2a] to-[#140c2e]" />

      {/* Blob 1 */}
      <div className="absolute top-[-200px] left-[-200px] w-[700px] h-[700px] 
        bg-purple-600 opacity-30 blur-[180px] rounded-full animate-blob" />

      {/* Blob 2 */}
      <div className="absolute bottom-[-200px] right-[-200px] w-[700px] h-[700px] 
        bg-violet-500 opacity-30 blur-[180px] rounded-full animate-blob animation-delay-2000" />

      {/* Blob 3 */}
      <div className="absolute top-[30%] left-[40%] w-[500px] h-[500px] 
        bg-indigo-500 opacity-20 blur-[140px] rounded-full animate-blob animation-delay-4000" />

      {/* Grid */}
      <div className="absolute inset-0 
        bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),
            linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]
        bg-[size:50px_50px]" />

    </div>
  );
}