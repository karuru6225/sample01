import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { useAuth } from './contexts/AuthContext';
import { useApi } from './contexts/ApiContext'; 

const Container = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 32px auto;
  width: 300px;
  & > * {
    margin-bottom: 16px;
  }
`;
const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 32px auto;
  width: 300px;
  & > * {
    margin-bottom: 8px;
  }
`;

function App() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState('');
  const {
    signUp,
    confirmSignUp,
    signIn,
    signOut,
    isLoading,
    isAuthenticated,
  } = useAuth();
  const {
    get
  } = useApi();
  const withAuthApi = useCallback((e) => {
    e.preventDefault();
    (async () => {
      try {
        const ret = await get<string>('withAuth');
        setResult(ret);
      } catch(e) {
        setResult('withAuthでエラー');
      }
    })();
  }, [get]);
  const withoutAuthApi = useCallback((e) => {
    e.preventDefault();
    (async () => {
      try {
        const ret = await get<string>('withoutAuth');
        setResult(ret);
      } catch(e) {
        setResult('withoutAuthでエラー');
      }
    })();
  }, [get]);
  return (
    <div className="App">
      <Container
        onSubmit={(e) => {
          e.preventDefault();
          signUp(username, email, password);
        }}
      >
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button>ユーザー作成</button>
      </Container>
      <Container
        onSubmit={(e) => {
          e.preventDefault();
          confirmSignUp(username, code);
        }}
      >
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="code"
          value={code}
          onChange={e => setCode(e.target.value)}
        />
        <button>確認コード送信</button>
      </Container>
      <Container
        onSubmit={(e) => {
          e.preventDefault();
          signIn(username, password);
        }}
      >
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button>ログイン</button>
      </Container>
      <Box>
        <button onClick={signOut}>
          ログアウト
        </button>
        <button onClick={withAuthApi}>
          withAuth api
        </button>
        <button onClick={withoutAuthApi}>
          withoutAuth api
        </button>
      </Box>
      <Box>
        <span>{isLoading ? 'ロード中' : '' }</span>
        <span>{isAuthenticated ? '認証済み' : 'ログアウト状態' }</span>
        <span>{result}</span>
      </Box>
    </div>
  );
}

export default App;
