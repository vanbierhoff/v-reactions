import { reaction, reactor } from './reactions/reactions';
import { expect } from 'vitest';


describe('vReactions', () => {
  it('should work', () => {

    const baseReact = reactor(100);
    const baseReact2 = reactor(200);


    reaction(() => {
      if (baseReact2() > baseReact()) {
        baseReact.set(baseReact() + 50);
        console.log('reaction TWO 1111', baseReact());
        return;
      }
      console.log('reaction TWO 2222', baseReact());
      expect(baseReact()).toBeTruthy;
    });


    setTimeout(() => {
      baseReact2.set(50);
    }, 3500);


    // expect(vReactions()).toEqual('v-reactions');
  });


  it('should deleted reactions list ', () => {
    const react1 = reactor(100);
    const react2 = reactor(200);

    let runCounter = 0;

    reaction(() => {
      runCounter++;
      if (react1() > react2()) {
        return;
      }
    });
    console.log('COUNTER:', runCounter)
    expect(runCounter).toBeLessThanOrEqual(1);
  });




});
