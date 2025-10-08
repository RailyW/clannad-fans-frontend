import logoEN from '../../assets/CLANNAD-logo-EN.png'
import logoJP from '../../assets/CLANNAD-logo-JP.png'

const GameLogo = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        userSelect: 'none',
      }}
    >
      <img src={logoEN}  alt={'CLANNAD-logo-EN.png'}/>
      <img src={logoJP}  alt={'CLANNAD-logo-JP.png'}/>
    </div>
  )
}

export default GameLogo;
