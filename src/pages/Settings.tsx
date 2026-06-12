import { Settings as SettingsIcon } from 'lucide-react'

export default function Settings() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Account Settings */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-6">Account Settings</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input type="email" className="input-field" placeholder="your@email.com" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input type="text" className="input-field" placeholder="Your Name" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Current Password</label>
              <input type="password" className="input-field" placeholder="••••••••" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">New Password</label>
              <input type="password" className="input-field" placeholder="••••••••" />
            </div>

            <button className="btn-primary">Save Changes</button>
          </div>
        </div>

        {/* Subscription */}
        <div className="bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">Current Plan</h3>
          <p className="text-3xl font-bold mb-2">Free</p>
          <p className="text-muted-foreground text-sm mb-6">
            1 account, 5 generations/month
          </p>
          <button className="w-full btn-primary">Upgrade to Pro</button>
        </div>
      </div>
    </div>
  )
}
