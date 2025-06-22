import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [plantInfo, setPlantInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      setPlantInfo(null);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false
  });

  const identifyPlant = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageData = e.target.result;

        const response = await fetch('/api/identify-plant', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imageData }),
        });

        if (!response.ok) {
          throw new Error('Failed to identify plant');
        }

        const result = await response.json();
        setPlantInfo(result);
      };
      reader.readAsDataURL(selectedImage);
    } catch (err) {
      setError('Failed to identify plant. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getDangerColor = (dangerLevel) => {
    switch (dangerLevel?.toLowerCase()) {
      case 'safe': return 'text-emerald-700 bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200';
      case 'mildly toxic': return 'text-amber-700 bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200';
      case 'moderately toxic': return 'text-orange-700 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200';
      case 'highly toxic': return 'text-red-700 bg-gradient-to-r from-red-50 to-pink-50 border-red-200';
      case 'deadly': return 'text-red-900 bg-gradient-to-r from-red-100 to-red-200 border-red-300';
      default: return 'text-slate-700 bg-gradient-to-r from-slate-50 to-gray-50 border-slate-200';
    }
  };

  const getDangerIcon = (dangerLevel) => {
    switch (dangerLevel?.toLowerCase()) {
      case 'safe': return '✅';
      case 'mildly toxic': return '⚠️';
      case 'moderately toxic': return '🟠';
      case 'highly toxic': return '🔴';
      case 'deadly': return '☠️';
      default: return '❓';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-8 -right-4 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-block p-4 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <div className="text-6xl animate-bounce">🌿</div>
            </div>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
              Plant Identifier
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Discover the secrets of nature. Upload any plant image and let AI reveal its identity, 
              safety information, and fascinating details.
            </p>
          </div>

          {/* Upload Area */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-8 border border-white/20 hover:shadow-3xl transition-all duration-300">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
                isDragActive
                  ? 'border-emerald-500 bg-emerald-50/50 scale-105 shadow-lg'
                  : 'border-slate-300 hover:border-emerald-400 hover:bg-slate-50/50 hover:scale-102'
              }`}
            >
              <input {...getInputProps()} />
              <div className="space-y-6">
                <div className={`text-8xl transition-transform duration-300 ${isDragActive ? 'scale-110' : ''}`}>
                  {isDragActive ? '🌱' : '📷'}
                </div>
                {isDragActive ? (
                  <div className="animate-pulse">
                    <p className="text-emerald-600 font-semibold text-xl">
                      Drop your plant image here...
                    </p>
                    <p className="text-emerald-500 text-sm mt-2">
                      Release to analyze
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-slate-700 font-semibold text-xl mb-2">
                      Drag & drop a plant image here
                    </p>
                    <p className="text-slate-500 text-lg">
                      or click to browse your files
                    </p>
                    <div className="mt-4 flex justify-center space-x-4 text-sm text-slate-400">
                      <span className="bg-slate-100 px-3 py-1 rounded-full">JPG</span>
                      <span className="bg-slate-100 px-3 py-1 rounded-full">PNG</span>
                      <span className="bg-slate-100 px-3 py-1 rounded-full">WEBP</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-8 text-center animate-fade-in">
                <div className="inline-block relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
                  <img
                    src={imagePreview}
                    alt="Selected plant"
                    className="relative max-w-md max-h-80 rounded-2xl shadow-2xl border-4 border-white/50"
                  />
                </div>
                <div className="mt-6">
                  <button
                    onClick={identifyPlant}
                    disabled={loading}
                    className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all duration-300 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-4 focus:ring-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span className="relative flex items-center">
                      {loading ? (
                        <>
                          <div className="animate-spin mr-3 text-xl">🌱</div>
                          Analyzing Magic...
                        </>
                      ) : (
                        <>
                          <span className="mr-3 text-xl">🔍</span>
                          Identify Plant
                        </>
                      )}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 text-center mb-8 border border-white/20 animate-pulse">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-emerald-200 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-emerald-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-2 text-2xl animate-pulse">🌿</div>
                </div>
              </div>
              <p className="text-slate-700 text-xl font-medium mb-2">Analyzing your plant...</p>
              <p className="text-slate-500">Our AI is examining every detail</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-6 mb-8 shadow-lg animate-shake">
              <div className="flex items-center justify-center space-x-3">
                <div className="text-3xl animate-bounce">⚠️</div>
                <div>
                  <p className="text-red-700 font-semibold text-lg">{error}</p>
                  <p className="text-red-600 text-sm">Please try again with a different image</p>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {plantInfo && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20 animate-fade-in">
              <div className="space-y-8">
                {/* Plant Name */}
                <div className="text-center border-b border-slate-200 pb-6">
                  <div className="inline-block p-3 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full mb-4">
                    <div className="text-4xl">🌿</div>
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                    {plantInfo.plantName}
                  </h2>
                  <div className="inline-flex items-center bg-slate-100 rounded-full px-4 py-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                    <p className="text-slate-600 font-medium">
                      Confidence: {plantInfo.confidence}
                    </p>
                  </div>
                </div>

                {/* Safety Alert */}
                <div className={`p-6 rounded-2xl border-2 shadow-lg ${getDangerColor(plantInfo.dangerLevel)}`}>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="text-4xl animate-pulse">
                      {getDangerIcon(plantInfo.dangerLevel)}
                    </div>
                    <div>
                      <h3 className="font-bold text-2xl">
                        {plantInfo.dangerLevel}
                      </h3>
                      <p className="text-sm opacity-80">Safety Assessment</p>
                    </div>
                  </div>
                  
                  {plantInfo.isDangerous && (
                    <div className="space-y-3 bg-white/30 rounded-xl p-4">
                      {plantInfo.toxicParts.length > 0 && (
                        <div className="flex items-start space-x-2">
                          <span className="text-lg">🔴</span>
                          <div>
                            <p className="font-semibold">Toxic Parts:</p>
                            <p>{plantInfo.toxicParts.join(', ')}</p>
                          </div>
                        </div>
                      )}
                      {plantInfo.symptoms.length > 0 && (
                        <div className="flex items-start space-x-2">
                          <span className="text-lg">⚕️</span>
                          <div>
                            <p className="font-semibold">Symptoms:</p>
                            <p>{plantInfo.symptoms.join(', ')}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Safety Tips */}
                {plantInfo.safetyTips.length > 0 && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200 shadow-lg">
                    <h3 className="font-bold text-blue-800 mb-4 flex items-center text-xl">
                      <span className="mr-3 text-2xl">💡</span>
                      Safety Guidelines
                    </h3>
                    <div className="grid gap-3">
                      {plantInfo.safetyTips.map((tip, index) => (
                        <div key={index} className="flex items-start space-x-3 bg-white/50 rounded-lg p-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-blue-700">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* General Information */}
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-2xl shadow-lg border border-slate-200">
                      <h3 className="font-bold text-slate-800 mb-3 flex items-center text-xl">
                        <span className="mr-3 text-2xl">📖</span>
                        Description
                      </h3>
                      <p className="text-slate-700 leading-relaxed">{plantInfo.generalInfo}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-2xl shadow-lg border border-emerald-200">
                      <h3 className="font-bold text-emerald-800 mb-3 flex items-center">
                        <span className="mr-2 text-xl">🌍</span>
                        Habitat
                      </h3>
                      <p className="text-emerald-700">{plantInfo.habitat}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl shadow-lg border border-purple-200">
                      <h3 className="font-bold text-purple-800 mb-3 flex items-center">
                        <span className="mr-2 text-xl">🛠️</span>
                        Uses
                      </h3>
                      <p className="text-purple-700">{plantInfo.uses}</p>
                    </div>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 p-6 rounded-2xl shadow-lg">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">⚖️</div>
                    <div>
                      <p className="text-amber-800 font-medium">
                        <strong>Important Disclaimer:</strong> This identification is powered by AI and should be used as a starting point only. 
                        For critical safety decisions, especially regarding plant toxicity, always consult with qualified botanists, 
                        horticulturists, or medical professionals.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}