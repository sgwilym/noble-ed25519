const ed = require('.');

(async () => {
  const priv = Uint8Array.from([0xde, 0xad, 0xbe, 0xef]);
  const pub = await ed.getPublicKey(priv);
  const msgs = ['a', 'b', 'c'];
  const umsg = 'd';
  const sigs = await Promise.all(msgs.map(m => ed.sign(m, priv)));
  const valid = await ed.verify(sigs[0], msgs[0], pub);
  console.log(sigs, valid);
  console.log('batch');
  const batch = sigs.map((s, i) => [s, msgs[i], pub]);
  batch.push([sigs[0], msgs[1], pub]);
  const v2 = await ed.verifyBatch(...batch);
  console.log(v2);
})();
