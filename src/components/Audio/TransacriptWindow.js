import * as React from 'react';

export default ({messages}) => {
	return (
    <>
		<div className="container transacriptWindow">
      <div className="card">
          {messages.map(m => <span style={{opacity: m.confidence}} className={m.speaker} key={m.id}>{m.text}</span>)}
      </div>
    </div>
    </>
	)
}