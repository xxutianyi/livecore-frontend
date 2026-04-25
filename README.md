# LiveCore Frontend

A standalone frontend using [Next](https://nextjs.org) for [LiveCore](https://github.com/xxutianyi/livecore-backend)

## Development

Clone the repo and ``cd`` into the directory.

```bash
# install npm dependence
pnpm install

# prepare .env file
cp .env.example .env
```

Prepare backend, update the ``.env`` file's ``URL`` & ``REVERB`` configuration:

```dotenv
NEXT_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

NEXT_PUBLIC_REVERB_HOST="localhost"
NEXT_PUBLIC_REVERB_PORT=8080
NEXT_PUBLIC_REVERB_SHCEME=http
NEXT_PUBLIC_REVERB_APP_KEY=your-app-key

```

## License

The LiveCore is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
