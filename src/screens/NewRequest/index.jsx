import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/store.jsx';
import BackHeader from '../../components/BackHeader.jsx';
import Step1 from './Step1.jsx';
import Step2 from './Step2.jsx';
import Step3 from './Step3.jsx';
import { C, primaryBtn } from '../../theme/tokens.js';

const EMPTY = { cat: '', title: '', desc: '', priority: 'Medium', area: 'Kitchen', photos: [] };

export default function NewRequest() {
  const { dispatch } = useStore();
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState(EMPTY);
  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));

  const bar = (n) => ({ flex: 1, height: 5, borderRadius: 3, background: step >= n ? C.green : '#E0DACE' });

  const back = () => (step > 1 ? setStep(step - 1) : nav('/maintenance'));
  const pickCat = (cat) => { set({ cat }); setStep(2); };
  const submit = () => { dispatch({ type: 'submitRequest', draft }); nav('/requests/done'); };

  return (
    <div className="jh-fade" style={{ padding: '2px 20px 40px' }}>
      <BackHeader title="New request" onBack={back} />
      <div style={{ display: 'flex', gap: 6, padding: '6px 2px 22px' }}>
        <div style={bar(1)} /><div style={bar(2)} /><div style={bar(3)} />
      </div>

      {step === 1 && <Step1 onPick={pickCat} />}
      {step === 2 && <Step2 draft={draft} set={set} />}
      {step === 3 && <Step3 draft={draft} set={set} />}

      <div style={{ marginTop: 24 }}>
        {step === 2 && <button onClick={() => setStep(3)} style={primaryBtn()}>Continue</button>}
        {step === 3 && <button onClick={submit} style={primaryBtn()}>Submit request</button>}
      </div>
    </div>
  );
}
