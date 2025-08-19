export default function Kewl() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-primary text-white p-4">
      <div className="max-w-4xl w-full bg-white/90 rounded-2xl p-6 shadow-xl border border-gray-200">
        <div className="flex justify-center mb-6">
          <img 
            src="/jp.jpg" 
            alt="Josh Forden" 
            className="w-32 h-32 rounded-full object-cover border-4 border-primary"
          />
        </div>
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold mb-2">
            <a 
              href="https://joshforden.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-success-indicator transition-colors duration-225"
            >
              Josh Forden
            </a>
          </h1>
          <p className="text-primary text-xl">3rd year CS Major (SysArch + ModSim)</p>
        </div>
        
        <div className="space-y-3">
          <p className="text-primary text-xl font-bold text-center">Here's a bit about me:</p>
          <p className="text-primary text-sm text-center">I'm from the Chicagoland area. </p>
          <p className="text-primary text-sm text-center">I love running, soccer, and the outdoors.</p>
          <p className="text-primary text-sm text-center">I ran the Atlanta marathon last spring!</p>
          <p className="text-primary text-sm text-center">I interned for The Home Depot as a backend developer this past summer.</p>
          <p className="text-primary text-sm text-center">I studied abroad in the College of Computing Barcelona Program in Summer 2024.</p>
          <p className="text-primary text-sm text-center">I'm a huge Liverpool FC fan.</p>
          <p className="text-primary text-sm text-center">
            <a 
              href="https://jogaflo.joshforden.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-success-indicator transition-colors duration-200 font-bold"
            >
              Here
            </a>
            's a webapp I made to turn your Strava activities into a soccer heatmap.
          </p>
          <p className="text-primary text-sm text-center">I love taking photos! Check out my <a href="https://www.instagram.com/josh_forden/" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-success-indicator transition-colors duration-200 font-bold">Instagram</a>.</p>
          <p className="text-primary text-xl text-center font-bold">I'm excited to join Bits of Good and make an impact in the Atlanta community!</p>
        </div>
      </div>
    </div>
  );
}
