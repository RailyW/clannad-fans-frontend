# API 服务模块

全局 API 调用功能模块，支持 Clannad Fans API 和文件访问。

## 基础地址

- **API 基地址**: `https://api.clannad.fans`
- **文件基地址**: `https://files.clannad.fans`

## 目录结构

```
src/
├── services/
│   ├── api.js          # API 服务封装
│   └── index.js        # 统一导出
├── utils/
│   └── request.js      # 请求工具函数
└── hooks/
    └── useApi.js       # API Hook
```

## API 接口

### 支持的端点

- `GET /` - 获取 API 根信息
- `GET /characters` - 获取角色列表
- `GET /images` - 获取图片列表
- `GET /musics` - 获取音乐列表
- `GET /voice-name-list` - 获取语音名称列表
- `GET /voices` - 获取语音列表

## 使用方式

### 1. 直接使用 API 服务

```javascript
import { apiService } from '@/services';

// 获取角色列表
const fetchCharacters = async () => {
  try {
    const response = await apiService.getCharacters();
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error);
  }
};

// 带参数查询
const fetchCharactersWithParams = async () => {
  const response = await apiService.getCharacters({ 
    page: 1, 
    limit: 10 
  });
  console.log(response.data);
};
```

### 2. 使用 React Hook（推荐）

```javascript
import { useApiCall } from '@/hooks/useApi';
import { apiService } from '@/services';

const MyComponent = () => {
  // 自动执行请求
  const { data, loading, error, refetch } = useApiCall(
    apiService.getCharacters
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <button onClick={refetch}>刷新</button>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};
```

### 3. 手动控制请求

```javascript
import { useApi } from '@/hooks/useApi';
import { apiService } from '@/services';

const MyComponent = () => {
  const { data, loading, error, execute } = useApi(
    apiService.getCharacters,
    { immediate: false }
  );

  const handleClick = async () => {
    try {
      await execute({ page: 1 });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button onClick={handleClick} disabled={loading}>
      {loading ? '加载中...' : '获取角色'}
    </button>
  );
};
```

### 4. 文件服务使用

```javascript
import { fileService } from '@/services';

// 获取文件 URL
const avatarUrl = fileService.getCharacterAvatar('avatar-nagisa.png');
// https://files.clannad.fans/character-avatar/avatar-nagisa.png

const tachieUrl = fileService.getCharacterTachie('tachie-nagisa.png');
// https://files.clannad.fans/character-tachie/tachie-nagisa.png

// 自定义路径
const customUrl = fileService.getFileUrl('path/to/file.png');
// https://files.clannad.fans/path/to/file.png

// 在组件中使用
const CharacterImage = ({ filename }) => {
  return (
    <img 
      src={fileService.getCharacterAvatar(filename)} 
      alt="character" 
    />
  );
};
```

### 5. 所有 API 方法

```javascript
import { apiService } from '@/services';

// 获取 API 信息
await apiService.getRoot();

// 获取角色列表
await apiService.getCharacters(params);

// 获取图片列表
await apiService.getImages(params);

// 获取音乐列表
await apiService.getMusics(params);

// 获取语音名称列表
await apiService.getVoiceNameList(params);

// 获取语音列表
await apiService.getVoices(params);
```

### 6. 所有文件服务方法

```javascript
import { fileService } from '@/services';

// 通用文件 URL
fileService.getFileUrl('path/to/file');

// 图片文件
fileService.getImageUrl('AKA.png');

// 音乐文件
fileService.getMusicFile('mabinogi', 'Key - 01. その桜簾を抜けて.flac');

// 语音文件
fileService.getVoiceFile('z0001#00000.ogg');
```

## 响应格式

所有 API 响应遵循以下格式：

```json
{
  "success": true,
  "data": {
    // 实际数据
  }
}
```

错误响应：

```json
{
  "success": false,
  "message": "错误信息"
}
```

## 错误处理

请求工具会自动处理以下错误：

1. HTTP 状态码错误（非 2xx）
2. 业务逻辑错误（`success: false`）
3. 网络错误

所有错误都会被捕获并抛出，可以使用 try-catch 或 Hook 的 error 状态处理。

## 配置

如需修改基础地址，编辑 `src/utils/request.js`：

```javascript
export const API_BASE_URL = 'https://api.clannad.fans';
export const FILES_BASE_URL = 'https://files.clannad.fans';
```

