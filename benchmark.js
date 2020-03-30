const {run, mark, logMem} = require('micro-bmark');
let ed = require('.');

run(async () => {
  // warm-up
  await mark(() => {
    ed.utils.precompute();
  });
  logMem();
  console.log();
  await mark('getPublicKey 1 bit', 1000, async () => {
    await ed.getPublicKey(2n);
  });

  const privKeys = new Array(1024).fill(0).map(a => ed.utils.generateRandomPrivateKey());
  const messages = new Array(1024).fill(0).map(a => ed.utils.generateRandomPrivateKey());
  let pubKeys, signatures, verifications, verificationsB;

  await mark('getPublicKey', async () => {
    pubKeys = await Promise.all(privKeys.map(priv => ed.getPublicKey(priv)));
  });
  await mark('sign', async () => {
    signatures = await Promise.all(messages.map((m, i) => ed.sign(m, privKeys[i])));
  });
  const batch = signatures.map((s, i) => [s, messages[i], pubKeys[i]]);
  await mark('verify', async () => {
    console.profile('verify');
    verifications = await Promise.all(batch.map(s => ed.verify(...s)));
    console.profileEnd('verify');
  });
  await mark('verifyBatch', async () => {
    console.profile('verifyBatch');
    verificationsB = await ed.verifyBatch(...batch);
    console.profileEnd('verifyBatch');
  });
  debugger;
  console.log(123, verifications, verificationsB);

  // // const sig = ed.SignResult.fromHex(sigHex);
  // // const pub = ed.Point.fromHex(pubHex);
  // await mark('verify', async () => {
  //   console.profile('a')
  //   for (let sigHex of sigHexes) {
  //     const verified = await ed.verify(sigHex, msgHex, pubHex);
  //   }
  // });

  // await mark('verifyBatch', 1, async () => {
  //   console.profile('a')
  //   const list = sigHexes.map(s => [s, msgHex, pubHex]);
  //   // console.log(list);
  //   const verified = await ed.verifyBatch(...list);
  //   console.profileEnd('a'); debugger;
  // });

  console.log();
  logMem();
});
