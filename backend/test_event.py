import asyncio
import server

async def main():
    res = await server.get_event_content()
    print('event:', res)

asyncio.run(main())
