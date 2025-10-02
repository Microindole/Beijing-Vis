/**
 * @file dataProcessor.js
 * @description 统一加载和处理项目所需的所有JSON数据。
 */

// 定义数据文件到程序中使用的键名(key)的映射
// 这样做的好处是，即使文件名改变，我们也只需要修改这里一处。
const DATA_FILES_MAP = {
  waterSystems: '02水系 - 总数据和各朝代数据.json',
  climate: '03气候 - 总数据和各朝代数据.json',
  vegetation: '04植被 - 总数据和各朝代数据.json',
  disasters: '05灾害 - 总数据和各朝代数据.json',
  governance: '07建制沿革 - 总数据和各朝代数据.json',
  keyBuildings: '09重点建筑 - 总数据和各朝代数据.json',
  otherBuildings: '10其他建筑 - 总数据和各朝代数据.json',
  population: '11人口 - 总数据和各朝代数据.json',
  culture: '13文化 - 总数据和各朝代数据.json',
  commerce: '14商业手工业 -总数据和各朝代数据.json',
  products: '15物产 - 总数据和各朝代数据.json',
  transport: '16交通 - 总数据和各朝代数据.json',
  events: '17事件 - 总数据和各朝代数据.json',
  wars: '18战争 - 总数据和各朝代数据.json',
  people: '19人物 - 总数据和各朝代数据.json',
};

/**
 * 异步加载所有定义好的数据文件。
 * @returns {Promise<Object>} 一个包含所有数据的对象，键为 DATA_FILES_MAP 中定义的键。
 */
export async function loadAllData() {
  console.log('Data Processor: Starting to load all datasets...');
  
  const dataEntries = Object.entries(DATA_FILES_MAP);
  
  try {
    const fetchPromises = dataEntries.map(([key, fileName]) => 
      fetch(`/json/${fileName}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to load ${fileName}: ${response.statusText}`);
          }
          return response.json();
        })
        .catch(error => {
            console.error(error);
            return []; // 如果某个文件加载失败，返回空数组，避免整个流程中断
        })
    );

    const results = await Promise.all(fetchPromises);

    const allData = {};
    dataEntries.forEach(([key], index) => {
      allData[key] = results[index];
    });

    console.log('Data Processor: All datasets loaded successfully!', allData);
    
    // 在这里可以进行一些全局的预处理
    // 例如，统一给灾害、战争、事件数据加上类型标识
    allData.disasters = allData.disasters.map(d => ({ ...d, type: 'disaster' }));
    allData.wars = allData.wars.map(w => ({ ...w, type: 'war' }));
    allData.events = allData.events.map(e => ({ ...e, type: 'event' }));

    // 合并冲击性事件为一个数组，方便使用
    allData.impactEvents = [
        ...allData.disasters,
        ...allData.wars,
        ...allData.events
    ];

    return allData;

  } catch (error) {
    console.error('Data Processor: A critical error occurred during data loading.', error);
    // 在实际项目中，这里可能需要更复杂的错误处理逻辑
    return null;
  }
}