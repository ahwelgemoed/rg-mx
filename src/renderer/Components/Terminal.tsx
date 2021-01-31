import React, { useState } from 'react'
import { Term } from '@dash4/react-xterm'
// import "@dash4/react-xterm/lib/ReactXterm.css";

const Terminal = () => {
  const [term, setTerm] = useState<Term | undefined>(undefined)

  function handleTermRef(uid: string, xterm: Term) {
    setTerm(xterm)
  }

  function handleStart() {
    // @ts-ignore
    term.write('npm start')
  }

  return (
    <>
      {/* @ts-ignore */}
      <Term ref_={handleTermRef} uid={'iasdasdd'} />
      <button onClick={handleStart}>start</button>
    </>
  )
}

export default Terminal
