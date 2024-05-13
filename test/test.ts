import { Tonfig } from '../src/Tonfig';

const content = `
[a]
b = "hello"
`;

Tonfig.loadFile('test.toml').then(tonfig => {
    console.log(tonfig.get('a.b'));

    tonfig.set('b.c', 'hi');

    console.log(tonfig.get('b.c'));

    tonfig.save();
});

Tonfig.loadConfig(content).then(tonfig => {
    console.log(tonfig.get('a.b'));

    tonfig.set('b.c', 'hi');

    console.log(tonfig.get('b.c'));
});
