import { useState } from 'react';

export default function ComfortCalculator() {
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [outdoorTemp, setOutdoorTemp] = useState('');
  const [outdoorHumidity, setOutdoorHumidity] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // 월별 날짜 수 확인
  const getDaysInMonth = (month) => {
    const daysInMonth = {
      '1': 31, '2': 29, '3': 31, '4': 30, '5': 31, '6': 30,
      '7': 31, '8': 31, '9': 30, '10': 31, '11': 30, '12': 31
    };
    return daysInMonth[month] || 31;
  };

  // 계절 확인
  const getSeason = (month) => {
    if (month >= 3 && month <= 5) return '봄';
    if (month >= 6 && month <= 8) return '여름';
    if (month >= 9 && month <= 11) return '가을';
    return '겨울';
  };

  const calculateComfort = () => {
    // 입력값 검증
    if (!month || !day || !outdoorTemp || !outdoorHumidity) {
      setError('모든 필드를 입력해주세요.');
      setResult(null);
      return;
    }

    const monthNum = parseInt(month);
    const dayNum = parseInt(day);
    const tempNum = parseFloat(outdoorTemp);
    const humidityNum = parseFloat(outdoorHumidity);

    if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      setError('월은 1부터 12 사이의 숫자여야 합니다.');
      setResult(null);
      return;
    }

    const maxDays = getDaysInMonth(month);
    if (isNaN(dayNum) || dayNum < 1 || dayNum > maxDays) {
      setError(`일은 1부터 ${maxDays} 사이의 숫자여야 합니다.`);
      setResult(null);
      return;
    }

    if (isNaN(tempNum)) {
      setError('온도는 숫자여야 합니다.');
      setResult(null);
      return;
    }

    if (isNaN(humidityNum) || humidityNum < 0 || humidityNum > 100) {
      setError('습도는 0부터 100 사이의 숫자여야 합니다.');
      setResult(null);
      return;
    }

    setError('');

    // 계절에 따른 기본 온/습도 설정
    const season = getSeason(monthNum);
    let baseTemp, baseHumidity, tempRange, humidityRange;

    switch (season) {
      case '봄':
        baseTemp = 22;
        baseHumidity = 50;
        tempRange = [20, 24];
        humidityRange = [40, 60];
        break;
      case '여름':
        baseTemp = 26;
        baseHumidity = 50;
        tempRange = [24, 28];
        humidityRange = [40, 60];
        break;
      case '가을':
        baseTemp = 22;
        baseHumidity = 50;
        tempRange = [20, 24];
        humidityRange = [40, 60];
        break;
      case '겨울':
        baseTemp = 20;
        baseHumidity = 40;
        tempRange = [18, 22];
        humidityRange = [30, 50];
        break;
    }

    // 실외 온도에 따른 실내 온도 조정
    let recommendedTemp = baseTemp;
    if (tempNum > 30) {
      recommendedTemp = Math.min(tempRange[1], baseTemp + 1);
    } else if (tempNum < 0) {
      recommendedTemp = Math.max(tempRange[0], baseTemp + 1);
    } else if (tempNum > 25) {
      recommendedTemp = Math.min(tempRange[1], baseTemp + 0.5);
    } else if (tempNum < 5) {
      recommendedTemp = Math.max(tempRange[0], baseTemp + 0.5);
    }

    // 실외 습도에 따른 실내 습도 조정
    let recommendedHumidity = baseHumidity;
    if (humidityNum > 70) {
      recommendedHumidity = Math.max(humidityRange[0], baseHumidity - 5);
    } else if (humidityNum < 30) {
      recommendedHumidity = Math.min(humidityRange[1], baseHumidity + 5);
    }

    // 특수한 날씨 조건에 대한 추가 조정
    let advice = '';
    if (season === '여름' && tempNum > 32) {
      advice = '폭염 상황에서는 실내 온도를 더 낮게 유지하고 충분한 수분 섭취를 권장합니다.';
    } else if (season === '겨울' && tempNum < -5) {
      advice = '혹한 상황에서는 실내 온도를 약간 높게 유지하고 난방 시 가습기 사용을 권장합니다.';
    } else if (humidityNum > 80) {
      advice = '외부 습도가 매우 높으니 제습기 사용을 권장합니다.';
    } else if (humidityNum < 20) {
      advice = '외부 습도가 매우 낮으니 가습기 사용을 권장합니다.';
    }

    setResult({
      date: `${monthNum}월 ${dayNum}일`,
      season,
      outdoorConditions: {
        temperature: tempNum,
        humidity: humidityNum
      },
      recommendedIndoor: {
        temperature: recommendedTemp.toFixed(1),
        humidity: recommendedHumidity.toFixed(0)
      },
      advice
    });
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">한국 기후 기반 적정 실내 온/습도 계산기</h1>
      
      <div className="bg-white p-4 rounded-md shadow mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">월</label>
            <input
              type="number"
              min="1"
              max="12"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              placeholder="1-12"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">일</label>
            <input
              type="number"
              min="1"
              max="31"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              placeholder="1-31"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">실외 온도 (°C)</label>
            <input
              type="number"
              step="0.1"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={outdoorTemp}
              onChange={(e) => setOutdoorTemp(e.target.value)}
              placeholder="예: 25.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">실외 습도 (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={outdoorHumidity}
              onChange={(e) => setOutdoorHumidity(e.target.value)}
              placeholder="0-100"
            />
          </div>
        </div>
        
        <button
          onClick={calculateComfort}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-300"
        >
          적정 온/습도 계산하기
        </button>
        
        {error && (
          <div className="mt-3 text-red-600 text-sm">
            {error}
          </div>
        )}
      </div>
      
      {result && (
        <div className="bg-white p-4 rounded-md shadow">
          <h2 className="text-xl font-semibold mb-3">적정 실내 환경 결과</h2>
          
          <div className="mb-3">
            <p className="text-gray-700">
              <span className="font-medium">날짜:</span> {result.date} ({result.season})
            </p>
            <p className="text-gray-700">
              <span className="font-medium">실외 환경:</span> {result.outdoorConditions.temperature}°C, 습도 {result.outdoorConditions.humidity}%
            </p>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-md mb-3">
            <h3 className="font-semibold text-blue-800 mb-1">권장 실내 환경</h3>
            <div className="flex space-x-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{result.recommendedIndoor.temperature}°C</div>
                <div className="text-sm text-gray-600">온도</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{result.recommendedIndoor.humidity}%</div>
                <div className="text-sm text-gray-600">습도</div>
              </div>
            </div>
          </div>
          
          {result.advice && (
            <div className="bg-yellow-50 p-3 rounded-md">
              <h3 className="font-semibold text-yellow-800 mb-1">추가 조언</h3>
              <p className="text-gray-700">{result.advice}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
