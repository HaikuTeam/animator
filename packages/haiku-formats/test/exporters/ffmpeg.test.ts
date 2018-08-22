import path = require('path');
import tape = require('tape');

import {VERSION} from '@core/HaikuComponent';
import {VideoExporter} from '@formats/exporters/video/videoExporter';
import * as ffmpeg from '@formats/exporters/ffmpeg';
import {getStub, stubProperties} from 'haiku-testing/lib/mock';

const basicBytecode = {
  timelines: {
    Default: {
      'haiku:wrapper': {
        'sizeAbsolute.x': {0: {value: 101}},
        'sizeAbsolute.y': {0: {value: 1}},
      },
    },
  },
  template: {
    elementName: 'div',
    attributes: {
      'haiku-id': 'wrapper',
    },
    children: [],
  },
};

tape('ffmpeg', (suite) => {
  suite.test('video', (test) => {
    const [mockNewFfmpegCommand, unstub] = stubProperties(ffmpeg, 'newFfmpegCommand');
    const videoExporter = new VideoExporter(basicBytecode, '<root>');
    const mockChain1 = getStub();
    mockNewFfmpegCommand.returns({
      addInput: mockChain1,
    });
    const mockChain2 = getStub();
    mockChain1.returns({
      withInputOptions: mockChain2,
    });
    const mockChain3 = getStub();
    mockChain2.returns({
      withVideoCodec: mockChain3,
    });
    const mockChain4 = getStub();
    mockChain3.returns({
      withOutputOptions: mockChain4,
    });
    mockChain4.returns({
      on: mockChain4,
      save: mockChain4,
    });

    // Test our chain!
    videoExporter.writeToFile('foo.mp4', 29.97);
    test.true(mockChain1.calledWith(path.join('<root>', 'png-29.97', 'frame-%07d.png')));
    test.true(mockChain2.calledWithMatch(['-framerate', '29.97']));
    test.true(mockChain3.calledWith('libx264'));
    test.deepEqual(
      mockChain4.getCall(0).args[0],
      [
        '-vf',
        'fps=29.97',
        '-vf',
        // Rounding down to closest multiple of 2, then ensuring positive dimensions.
        'scale=100:2',
        '-pix_fmt',
        'yuv420p',
      ],
    );

    test.is(mockChain4.getCall(3).args[0], 'foo.mp4');

    unstub();
    test.end();
  });

  // @ts-ignore
  global.haiku[VERSION].HaikuGlobalAnimationHarness.cancel();
  suite.end();
});
