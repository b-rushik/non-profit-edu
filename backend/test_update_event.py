import asyncio
from server import EventContent, update_event_content, get_event_content

async def main():
    new_event = EventContent(title='Local Test Event', description='Updated desc', date='Jan 20, 2026', location='Test Hall')
    res = await update_event_content(new_event)
    print('update response:', res)
    ev = await get_event_content()
    print('read back:', ev)

asyncio.run(main())
