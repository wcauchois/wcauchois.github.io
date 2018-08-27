import { h, Component } from 'preact';
import { Query } from './Query';

export interface AppProps {
  name: string;
}

interface AppState {
  name: string;
}

const USER_NAME = 'wcauchois';

const repoQuery = `
  {
    user(login: "${USER_NAME}") {
      repositories(first: 100) {
        nodes {
          name
          isFork
          createdAt
          updatedAt
          url
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

interface Repository {
  name: string;
  isFork: boolean;
  createdAt: string;
  updatedAt: string;
  description: string;
  url: string;
  primaryLanguage: {
    name: string,
  };
  owner: {
    login: string;
  };
}

interface RepoQueryResponse {
  user: {
    repositories: {
      nodes: Repository[];
    };
  };
}

function filterAndSortRepos(repos: Repository[]) {
  const newRepos = repos.filter(repo => !repo.isFork && repo.owner.login === USER_NAME);
  newRepos.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  return newRepos;
}

export class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = { name: props.name };
  }

  render(props: AppProps, state: AppState) {
    return <Query query={repoQuery}>
      {(loading: boolean, error?: Error, data?: RepoQueryResponse) => {
        if (loading) {
          return <div>Loading</div>;
        } else if (error) {
          return <div>Error</div>;
        }

        const repos = filterAndSortRepos(data!.user.repositories.nodes);
        return <div>
          <ul>
            {repos.map(repo => <li class="repo-item">
              <div class="repo-name">
                <a href={repo.url} class="repo-link">
                  {repo.name}
                </a>
              </div>
              <div class="repo-language">
                {repo.primaryLanguage.name}
              </div>
              <div class="repo-description">
                {repo.description}
              </div>
            </li>)}
          </ul>
        </div>;
      }}
    </Query>;
  }
}
