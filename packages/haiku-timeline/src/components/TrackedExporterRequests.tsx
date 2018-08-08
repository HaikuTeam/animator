import {shell} from 'electron';
import {ExporterRequest} from 'haiku-sdk-creator/lib/exporter';
import {LoadingButton} from 'haiku-ui-common/lib/react/LoadingButton';
import * as React from 'react';

const STYLES = {
  listItem: {
    float: 'left',
    marginRight: 5,
    display: 'block',
  },
};

export interface TrackedExporterRequestsProps {
  trackedExporterRequests: ExporterRequest[];
}

const showItemLocation = (request: ExporterRequest) => {
  if (request.progress === 1 && typeof request.filename === 'string') {
    shell.showItemInFolder(request.filename);
  }
};

export class TrackedExporterRequests
  extends React.PureComponent<TrackedExporterRequestsProps> {

  render () {
    return (
      <ul
        style={{
          float: 'left',
          margin: '0 5px 0 0',
          listStyleType: 'none',
        }}
      >
        {this.props.trackedExporterRequests.map((request) => (
          <li style={STYLES.listItem} key={request.filename.toString()}>
            <LoadingButton
              disabled={false}
              done={request.progress === 1}
              effectivelyDisabled={false}
              progress={request.progress * 100}
              speed={request.progress === 1 ? '0.1s' : '5s'}
              onClick={showItemLocation.bind(undefined, request)}
            >
              {request.format}
            </LoadingButton>
          </li>
        ))}
      </ul>
    );
  }
}
