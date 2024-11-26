import { reaction, reactor } from './reactions/reactions';
import { expect } from 'vitest';
import { provideStackRunner } from '@v-reactions/source';


describe('vReactions', () => {
  provideStackRunner('sync');
  it('should work', () => {

    const baseReact = reactor(100);
    const baseReact2 = reactor(200);


    reaction(() => {
      if (baseReact2() > baseReact()) {
        baseReact.set(baseReact() + 50);
        return;
      }

      expect(baseReact()).toBeTruthy;
    });

  });


  it('should deleted reactions list ', () => {
    const react1 = reactor(100);
    const react2 = reactor(200);

    let runCounter = 0;

    reaction(() => {
      runCounter++;
      if (react1() < react2()) {
        react1.set(react1() + 50);
        return;
      }
    });
    console.log('COUNTER:', runCounter);
    expect(runCounter).toBeLessThanOrEqual(3);
  });

  it('should empty reactions list  cleared creations', () => {
    let react1: any = reactor(100);
    let react2: any = reactor(200);


    reaction(() => {
      if (react1() > react2()) {
        return;
      }
    });

    react1 = null;
    react2 = null;

    expect(reaction).toBeTruthy;
  });


  it('Check recursive limit calls ', () => {
    let runCounter = 0;

    const react1 = reactor(100, { deep: 10 });
    const react2 = reactor(200, { deep: 10 });

    reaction(() => {
      runCounter++;
      console.log('react ONE 1', react1());
      console.log('react ONE 2', react2());
      //  react1.set(react1() + react2());
      return;
    });

    reaction(() => {
      runCounter++;
      console.log('react two', react1());
      console.log('react two', react2());
      //   react1.set(react1() + react2());
      return;
    });

  //  react1.set(100);
    react2.set(199);
    //   react1.set(300);
    console.log(' RUN COUNTER:', runCounter);
    console.log('RESULT:', react2());
    console.log('RESULT REACT 1:', react1());
    setTimeout(() => {
      console.log('RESULT REACT setTimeout:', react1());
      react2.set(205);
      expect(runCounter).toBeLessThanOrEqual(20);
    },2000)

  });


});
