import React from 'react';
import { Award, Calendar, ExternalLink, Shield, BookOpen, GraduationCap } from 'lucide-react';
import { UserProfile } from '@/types/user';

interface CertificatesCardProps {
  profile: UserProfile;
}

const CertificatesCard: React.FC<CertificatesCardProps> = ({ profile }) => {
  const getCertificateIcon = (certName: string) => {
    const name = certName.toLowerCase();
    if (name.includes('ielts')) return '🇬🇧';
    if (name.includes('toeic')) return '🌐';
    if (name.includes('toefl')) return '📚';
    if (name.includes('cambridge')) return '🎓';
    return '📜';
  };

  const getCertificateColor = (certName: string) => {
    const name = certName.toLowerCase();
    if (name.includes('ielts')) return 'from-blue-500 to-indigo-600';
    if (name.includes('toeic')) return 'from-emerald-500 to-teal-600';
    if (name.includes('toefl')) return 'from-purple-500 to-pink-600';
    if (name.includes('cambridge')) return 'from-amber-500 to-orange-600';
    return 'from-slate-500 to-gray-600';
  };

  return (
    <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl pl-6 pr-6 pt-4 pb-6 shadow-xl border border-indigo-100/50 dark:border-slate-700/50 relative overflow-hidden">
      {/* Enhanced Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/40 via-indigo-50/30 to-blue-50/40 dark:from-purple-900/20 dark:via-indigo-900/15 dark:to-blue-900/20"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-indigo-200/30 dark:from-purple-800/20 dark:to-indigo-800/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-200/20 to-purple-200/20 dark:from-blue-800/15 dark:to-purple-800/15 rounded-full blur-2xl"></div>

      {/* Header at the top */}
      <div className="relative flex items-center gap-3 mb-4 pt-2">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
          <Award className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Professional Certificates</h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Validated qualifications and achievements</p>
        </div>
      </div>

      <div className="relative">
        {profile.certificates && profile.certificates.length > 0 ? (
          <div className="max-h-[600px] overflow-y-auto scrollbar-hide">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pl-2 pr-2">
              {profile.certificates.map(cert => (
                <div key={cert.id} className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-slate-200/60 dark:border-slate-700/60 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 w-full min-w-0">
                  {/* Certificate gradient border */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${getCertificateColor(cert.name)} rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

                  {/* Certificate header */}
                  <div className="relative flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 bg-gradient-to-br ${getCertificateColor(cert.name)} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <span className="text-xl">{getCertificateIcon(cert.name)}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base leading-tight">{cert.name}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{cert.issuer}</p>
                      </div>
                    </div>

                    {/* Verification badge */}
                    {cert.verificationUrl && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-medium">
                        <Shield className="h-3 w-3" />
                        <span>Verified</span>
                      </div>
                    )}
                  </div>

                  {/* Certificate details */}
                  <div className="relative space-y-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Calendar className="h-4 w-4 text-slate-500" />
                      <span className="font-medium">
                        {new Date(cert.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>

                    {cert.credentialId && (
                      <div className="bg-slate-50/80 dark:bg-slate-700/50 rounded-lg p-3 border border-slate-200/50 dark:border-slate-600/50">
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Credential ID</p>
                        <p className="text-sm font-mono text-slate-700 dark:text-slate-300 mt-1">{cert.credentialId}</p>
                      </div>
                    )}

                    {/* Verification link */}
                    {cert.verificationUrl && (
                      <a
                        href={cert.verificationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 group/link"
                      >
                        <ExternalLink className="h-3 w-3 group-hover/link:scale-110 transition-transform" />
                        <span>Verify Certificate</span>
                      </a>
                    )}
                  </div>

                  {/* Premium certificate indicator */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-2 h-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-sm"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Award className="h-10 w-10 text-slate-400" />
            </div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No Certificates Yet</h4>
            <p className="text-slate-600 dark:text-slate-400 mb-4 max-w-sm mx-auto">
              Earn your first professional certificate by completing advanced courses and passing official exams.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-lg border border-purple-200/50 dark:border-purple-700/50">
              <GraduationCap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Start Learning</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificatesCard;
