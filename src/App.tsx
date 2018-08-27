import { h, Component } from 'preact';
import { Query } from './Query';

export interface AppProps {
  name: string;
}

interface AppState {
  name: string;
}

const repoQuery = `
  {
    user(login: "wcauchois") {
      repositories(first: 100) {
        nodes {
          name
          isFork
          createdAt
          updatedAt
          description
          primaryLanguage {
            name
          }
          owner {
            login
          }
        }
      }
    }
  }
`;

export class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = { name: props.name };
  }

  render(props: AppProps, state: AppState) {
    return <Query query={repoQuery}>
      {(loading: boolean, error: Error, data: any) => {
        console.log('in renderFn', loading, error, data);
        return <div>
          hi hi also<br />
          {loading.toString()}<br />
          {error && error.message}<br />
          {data}
        </div>;
      }}
    </Query>;
  }
}
