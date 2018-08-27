import { h, Component, RenderableProps, ComponentChild } from 'preact';

interface QueryProps {
  query: string;
}

interface QueryState {
  type: 'loading' | 'loaded' | 'error';
  data?: any;
  error?: Error;
}

const API_TOKEN = `b44f4ca9cf09c8d60aaaacd2c981b326399d24de`;
const ENDPOINT = `https://api.github.com/graphql`;

async function queryGraphQL(query: string) {
  const headers = new Headers();
  headers.append('Authorization', `Bearer ${API_TOKEN}`);
  const body = JSON.stringify({ query });
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers,
    body
  });
  const json = await response.json();
  return json;
}

type RenderFn = (loading: boolean, error?: Error, data?: any) => ComponentChild;

export class Query extends Component<QueryProps, QueryState> {
  constructor() {
    super();
    this.state = { type: 'loading' };
  }

  async componentWillMount() {
    try {
      const { data, errors } = await queryGraphQL(this.props.query);
      if (errors && errors.length) {
        throw new Error(errors[0].message);
      }
      this.setState({
        type: 'loaded',
        data
      });
    } catch (e) {
      this.setState({
        type: 'error',
        error: e
      });
    }
  }

  render(props: RenderableProps<QueryProps>, state: QueryState) {
    const renderFn = (props.children! as RenderFn[])[0];
    if (state.type === 'loading') {
      return renderFn(true, undefined, undefined);
    } else if (state.type === 'loaded') {
      return renderFn(false, undefined, state.data);
    } else if (state.type === 'error') {
      return renderFn(false, state.error, undefined);
    } else {
      throw new Error(`Illegal state`);
    }
  }
}
