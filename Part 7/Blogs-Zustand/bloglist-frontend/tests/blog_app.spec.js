import { test, expect } from '@playwright/test'


test.describe('Blog app', () => {
    test.beforeEach(async ({ page }) => {
        await page.request.post('http://localhost:3001/api/testing/reset')
        await page.request.post('http://localhost:3001/api/users', {
            data: {
                name: 'Majkel Dzekson',
                username: 'Jeksi',
                password: '2137'
            }
        })
        await page.request.post('http://localhost:3001/api/users', {
            data: {
                name: 'Karol Wojtyla',
                username: 'Papi',
                password: '420'
            }
        })
        await page.goto('http://localhost:5173')
    })

    test('Login form is shown', async ({ page }) => {
        const locator = page.getByText('Log in to blog app')
        await expect(locator).toBeVisible()
    })
    test.describe('When logged in', () => {
        test.beforeEach(async ({ page }) => {
            await page.getByRole('textbox', { name: 'username' }).fill('Jeksi')
            await page.getByRole('textbox', { name: 'password' }).fill('2137')
            await page.getByRole('button', {name: 'login'}).click()
        })

        test('Succes with loging in', async ({ page }) => {
            await expect(page.getByText('Majkel Dzekson logged in').toBeVisible)
        })

        test.describe('When created blog', () =>{
            test.beforeEach(async ({ page }) =>{
                await page.getByRole('button', {name: 'create new blog'}).click()
                await expect(page.getByText("Create new blog").toBeVisible)
                await page.getByRole('textbox', {name: 'title:'}).fill('Blog about cute kittens')
                await page.getByRole('textbox', {name: 'author:'}).fill('Majkel Dzekson')
                await page.getByRole('textbox', {name: 'url:'}).fill('kitty.uwu.com')
                await page.getByRole('button', {name: 'create'}).click()
                await expect(page.getByText("Blog about cute kittens Majkel Dzekson")).toBeVisible()
            })
            
            test('Succes creating new blog', async ({ page }) => {
                await expect(page.getByText("Blog about cute kittens Majkel Dzekson")).toBeVisible()
            })

            test('Can delete a blog', async ({ page }) => {
                await page.getByRole('button', {name: 'show'}).click()
                await page.getByRole('button', {name: 'Remove'}).click()
                await expect(page.getByText("Blog about cute kittens Majkel Dzekson")).not.toBeVisible()    
            })

            test.describe('Another user', () =>{
                test.beforeEach(async ({ page }) =>{
                    await page.getByRole('button', {name: 'logout'}).click()
                    await page.getByRole('textbox', { name: 'username' }).fill('Papi')
                    await page.getByRole('textbox', { name: 'password' }).fill('420')
                    await page.getByRole('button', {name: 'login'}).click()
                })

                test('Doesnt see the remove button', async ({ page }) => {
                    await page.getByRole('button', {name: 'show'}).click()
                    await expect(page.getByRole('button', {name: 'Remove'})).not.toBeVisible()
                })
            })

            test('Can like a blog', async ({ page }) => {
                await page.getByRole('button', {name: 'show'}).click()
                await page.getByRole('button', {name: 'Like'}).click()
                await expect(page.getByText("1")).toBeVisible()
            })

            test('Blogs are ordered by likes', async ({ page }) => {
                await page.getByRole('button', {name: 'create new blog'}).click()
                await expect(page.getByRole('heading', { name: 'Create new blog' })).toBeVisible()
                await page.getByRole('textbox', {name: 'title:'}).fill('2nd blog')
                await page.getByRole('textbox', {name: 'author:'}).fill('Jhon Doe')
                await page.getByRole('textbox', {name: 'url:'}).fill('test.uwu.com')
                await page.getByRole('button', {name: 'create'}).click()
                await expect(page.getByText("2nd blog Jhon Doe")).toBeVisible()
                await page.getByRole('button', {name: 'show'}).first().click()
                await page.getByRole('button', {name: 'Like'}).first().click()
                await page.getByRole('button', {name: 'show'}).first().click()
                await expect(page.getByRole('button', {name: 'Like'}).nth(1)).toBeVisible()
                const secondBlog = page.locator('.blog').nth(1)
                await page.getByRole('button', {name: 'Like'}).nth(1).click()
                await page.getByRole('button', {name: 'Like'}).nth(1).click()
                await expect(secondBlog).toContainText('1')
                await page.getByRole('button', {name: 'Like'}).nth(1).click()
                await expect(secondBlog).toContainText('2')
                const blogs = page.locator('.blog')

                // Sprawdzamy czy pierwszy blog (ten z największą ilością lajków) to '2nd blog'
                await expect(blogs.nth(0)).toContainText('2nd blog')

                // Sprawdzamy czy drugi blog to 'Blog about cute kittens'
                await expect(blogs.nth(1)).toContainText('Blog about cute kittens')
            })
        })


    })
    
})