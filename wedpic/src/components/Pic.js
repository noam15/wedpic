const Pic = ({ src, onClick }) => {
  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };
  return (
    <div
      className='div-container'
      style={{
        maxWidth: '35vw',
        margin: 'auto',
        background: '#f6f6f6',
        height: '35vw',
        borderRadius: '1em',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <img
        style={{ width: '35vw', padding: '.2em' }}
        src={URL.createObjectURL(src)}
        alt='img'
        onClick={onClick}
      />
    </div>
  );
};

export default Pic;
