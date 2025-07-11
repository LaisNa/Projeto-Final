import { ProgressSpinner } from "primereact/progressspinner";

const LoaderBox: React.FC = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%'
  }}>
    <ProgressSpinner
      style={{ width: '50px', height: '50px' }}
      strokeWidth="8"
      fill="var(--surface-ground)"
      animationDuration=".5s" />
  </div>
)

export {
  LoaderBox
}