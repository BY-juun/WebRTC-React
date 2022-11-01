import React, { useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const submit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputRef.current) return;
    navigate(`/room/${inputRef.current.value}`);
  }, []);

  return (
    <>
      <form onSubmit={submit}>
        <input placeholder="방 번호 입력" ref={inputRef} />
        <button>입력</button>
      </form>
    </>
  );
};

export default Home;
