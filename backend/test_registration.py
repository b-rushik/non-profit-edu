import asyncio
from server import StudentRegistration, register_student, get_registration_count

async def main():
    before = await get_registration_count()
    print('counts before:', before)

    new = StudentRegistration(name='Test Student', age='13', school='Test School', email='test@example.com', phone='1234567890', consent=True)
    res = await register_student(new)
    print('register response:', res)

    after = await get_registration_count()
    print('counts after:', after)

asyncio.run(main())
