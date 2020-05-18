import React, { useEffect } from 'react';
import styled from "styled-components";

const Button = styled.a`
  /* This renders the buttons above... Edit me! */
  display: inline-block;
  border-radius: 3px;
  padding: 0.5rem 0;
  margin: 0.5rem 1rem;
  width: 11rem;
  background: white;
  color: black;
  border: 2px solid black;
`
export default function Popup() {
    useEffect(() => {
        chrome.runtime.sendMessage({ popupMounted: true });
    }, []);

    return <div>
        Hello, world!
        <Button href="http://google.com">Okay this is a test</Button>
    </div>;
}