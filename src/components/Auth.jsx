import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Auth() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLogin, setIsLogin] = useState(true)

    const handleAuth = async (e) => {
        e.preventDefault()
        setLoading(true)
        if (isLogin) {
            const { error } = await supabase.auth.signInWithPassword({ email, password })
            if (error) alert(error.message)
        } else {
            const { error } = await supabase.auth.signUp({ email, password })
            if (error) alert('Check your email for the login link!')
            else alert('Check your email for the login link!')
        }
        setLoading(false)
    }

    return (
        <div className="row flex-center flex" style={{ padding: '20px' }}>
            <div className="col-6 form-widget" style={{ maxWidth: '400px', margin: '0 auto' }}>
                <h1 className="header" style={{ textAlign: 'center' }}>Supabase + React</h1>
                <p className="description" style={{ textAlign: 'center' }}>Sign in via magic link with your email below</p>
                <form className="form-widget" onSubmit={handleAuth}>
                    <div style={{ marginBottom: '10px' }}>
                        <input
                            className="inputField"
                            type="email"
                            placeholder="Your email"
                            value={email}
                            required={true}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                        />
                        <input
                            className="inputField"
                            type="password"
                            placeholder="Your password"
                            value={password}
                            required={true}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '10px' }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        <button className={'button block chain'} disabled={loading}>
                            {loading ? <span>Loading</span> : <span>{isLogin ? 'Sign In' : 'Sign Up'}</span>}
                        </button>
                        <button type="button" className="button block" onClick={() => setIsLogin(!isLogin)}>
                            {isLogin ? 'Need an account?' : 'Have an account?'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
