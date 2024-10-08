import { reaction, reactor } from './reactions/reactions';
import { expect } from 'vitest';


describe('vReactions', () => {
  it('should work', () => {

    const baseReact = reactor(100);
    const baseReact2 = reactor(200);


    reaction(() => {
      if (baseReact2() > baseReact()) {
        console.log('BASE REACT PLUS + 50');
        baseReact.set(baseReact() + 50);
        return;
      }
      console.log('BASE REACT END:', baseReact());
      expect(baseReact()).toBeTruthy;
    });


    setTimeout(() => {
      baseReact2.set(50);
    }, 3500);

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
      console.log('RUN in should empty reactions ');
      if (react1() > react2()) {
        return;
      }
    });

    react1 = null;
    react2 = null;

    console.log(react2);

    expect(reaction).toBeTruthy;
  });




  it('Check recursive limit calls ', () => {
    const react1 = reactor(100, {deep: 2});
    const react2 = reactor(200);

    let runCounter = 0;

    reaction(() => {
      runCounter++;
      if (react1() < react2()) {
        react1.set(react1() + 50);
        return;
      }
    });
    react1.set(100);
    console.log('COUNTER:', runCounter);
    expect(runCounter).toBeLessThanOrEqual(4);
  });


});
